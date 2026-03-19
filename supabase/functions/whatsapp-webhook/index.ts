import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOTION_DB_ID = "30d28f9ae76080fab14cdd7aeed50761";

serve(async (req) => {
    if (req.method === 'GET') {
        const url = new URL(req.url)
        const mode = url.searchParams.get('hub.mode')
        const token = url.searchParams.get('hub.verify_token')
        const challenge = url.searchParams.get('hub.challenge')
        const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN')

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            return new Response(challenge, { status: 200 })
        }
        return new Response('Forbidden', { status: 403 })
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const changes = body.entry?.[0]?.changes?.[0]?.value
        if (!changes || !changes.messages) return new Response('NO_MESSAGES', { status: 200 })

        const messageData = changes.messages[0]
        const from = messageData.from
        const messageText = messageData.text?.body || ""
        const contactName = changes.contacts?.[0]?.profile?.name || "Cliente WhatsApp"

        const apiKey = Deno.env.get('OPENAI_API_KEY')
        const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID')
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const notionToken = Deno.env.get('NOTION_TOKEN')
        const whatsappToken = Deno.env.get('WHATSAPP_TOKEN')
        const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Buscar primeira organização disponível para vincular (Multi-tenant ready)
        let organizationId = null;
        const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .limit(1)
            .single();

        if (orgData) organizationId = orgData.id;

        // Buscar se existe um lead com este telefone para vincular
        let leadId = null;
        const { data: leadData } = await supabase
            .from('leads')
            .select('id')
            .eq('phone', from)
            .limit(1)
            .maybeSingle();

        if (leadData) {
            leadId = leadData.id;
        } else {
            // Criar lead automaticamente se não existir
            const { data: newLead, error: createError } = await supabase
                .from('leads')
                .insert({
                    phone: from,
                    name: contactName,
                    organization_id: organizationId,
                    status: 'novo',
                    source: 'WhatsApp',
                    metadata: { auto_created: true }
                })
                .select('id')
                .single();

            if (!createError && newLead) leadId = newLead.id;
        }

        // 1. Criar ou Atualizar Sessão
        const { data: session, error: sessionError } = await supabase
            .from('whatsapp_sessions')
            .upsert({
                phone: from,
                organization_id: organizationId,
                lead_id: leadId,
                last_message_at: new Date().toISOString(),
                metadata: {
                    name: contactName
                }
            }, { onConflict: 'phone' })
            .select()
            .single();

        if (sessionError) throw sessionError

        // 2. Salvar Mensagem do Cliente no Supabase
        await supabase.from('whatsapp_messages').insert({
            session_id: session.id,
            role: 'user',
            content: messageText
        })

        if (!session.is_ai_active) {
            return new Response('AI_PAUSED', { status: 200 })
        }

        // 3. Identificar Contexto no Notion
        let clientContext = "Cliente não identificado no Notion."
        try {
            const notionResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${notionToken}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter: { property: "Telefone", phone_number: { contains: from.slice(-8) } } })
            })
            const nData = await notionResponse.json()
            if (nData.results?.length > 0) {
                const client = nData.results[0]
                const name = client.properties.Nome?.title?.[0]?.plain_text || "Cliente"
                clientContext = `O cliente é **${name.toUpperCase()}**. Identificado no Notion.`
            }
        } catch (ne) {
            console.error('Notion Error:', ne.message)
        }

        let threadId = session.external_thread_id
        if (!threadId) {
            const tResp = await fetch('https://api.openai.com/v1/threads', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' }
            })
            const tData = await tResp.json()
            threadId = tData.id
            await supabase.from('whatsapp_sessions').update({ external_thread_id: threadId }).eq('id', session.id)
        }

        // 4. OpenAI Assistant
        await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' },
            body: JSON.stringify({ role: 'user', content: `${clientContext}\n\nMensagem: ${messageText}` })
        })

        const runResp = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' },
            body: JSON.stringify({
                assistant_id: assistantId,
                additional_instructions: `Você é o Assistente Virtual do Dr. Roberto Falco (FALCO ASSESSORIA JURÍDICA).
Sua missão é: Acolher o cliente, extrair o NOME, WHATSAPP, E-MAIL e saber se trabalha de CARTEIRA ASSINADA (CLT).

REGRAS DE OURO:
1. DADOS: Nome -> WhatsApp -> E-mail (UM por vez). NUNCA diga "para finalizar" nesta etapa.
2. ESCUTA: Após os dados, peça: "Qual é a sua dúvida ou problema no trabalho?".
3. TÉCNICA: Uma pergunta por vez.
4. FECHAMENTO: Avise que passará ao Dr. Roberto para agendar reunião.
5. SÓ use DATA_START no fim de tudo.

FORMATO OBRIGATÓRIO (No final de cada resposta):
---DATA_START---
NOME: [Nome]
TELEFONE: [WhatsApp]
E-MAIL: [E-mail]
CARTEIRA: [Sim/Não]
CASO: [Breve resumo]
---DATA_END---`
            })
        })
        const run = await runResp.json()

        // Polling (Resumo)
        let status = 'queued'
        for (let i = 0; i < 15; i++) {
            const sResp = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
                headers: { 'Authorization': `Bearer ${apiKey}`, 'OpenAI-Beta': 'assistants=v2' }
            })
            const sData = await sResp.json()
            status = sData.status
            if (status === 'completed') break
            await new Promise(r => setTimeout(r, 1000))
        }

        const mResp = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages?limit=1`, {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'OpenAI-Beta': 'assistants=v2' }
        })
        const mData = await mResp.json()
        const aiResponse = mData.data[0]?.content[0]?.text?.value || "..."

        // 5. Salvar Resposta da IA no Supabase
        await supabase.from('whatsapp_messages').insert({
            session_id: session.id,
            role: 'assistant',
            content: aiResponse
        })

        // 6. Enviar para WhatsApp
        await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${whatsappToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: { body: aiResponse }
            })
        })

        return new Response('DONE', { status: 200 })

    } catch (e: any) {
        return new Response(e.message, { status: 500 })
    }
})
