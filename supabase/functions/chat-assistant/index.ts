import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { message, threadId } = await req.json()
        const apiKey = Deno.env.get('OPENAI_API_KEY')
        const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID')
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!apiKey || !assistantId || !supabaseUrl || !supabaseKey) {
            throw new Error('Configuração incompleta (OpenAI ou Supabase)')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. Gerenciar Thread
        let effectiveThreadId = threadId
        if (!effectiveThreadId) {
            const threadResponse = await fetch('https://api.openai.com/v1/threads', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                }
            })
            const thread = await threadResponse.json()
            effectiveThreadId = thread.id
        }

        // 2. Adicionar Mensagem do Usuário
        await fetch(`https://api.openai.com/v1/threads/${effectiveThreadId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                role: 'user',
                content: message
            })
        })

        // 3. Iniciar o Run com Instruções Adicionais Fortificadas
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${effectiveThreadId}/runs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                assistant_id: assistantId,
                additional_instructions: `Você é o Assistente Virtual do Dr. Roberto Falco (FALCO ASSESSORIA JURÍDICA).
Sua missão é: Acolher o cliente, extrair o NOME, WHATSAPP, E-MAIL e saber se trabalha de CARTEIRA ASSINADA.

REGRAS DE OURO (Siga à risca):
1. TERMINOLOGIA JURÍDICA: Nunca use "regime CLT". Use apenas "CARTEIRA ASSINADA".
2. LÓGICA JURÍDICA (IMPORTANTE): 
   - Nunca relacione "Horas Extras" com "Acúmulo de Função". São direitos distintos.
   - Acúmulo de Função (cobrança de passagens) NÃO é a causa das horas extras.
   - Se o cliente falar de um problema (ex: horas extras), explore esse problema ANTES de mudar de assunto.
   - Use transições claras ao mudar de tópico: "Além disso...", "Outro ponto importante é...", "Mudando um pouco de assunto, para eu entender melhor..."
3. CATEGORIAS DE MOTORISTAS/RODOVIÁRIOS:
   - Acúmulo de Função = COBRANÇA DE PASSAGENS.
   - Danos Morais/Condições = Falta de BANHEIRO, falta de DINHEIRO TROCADO (fundo de caixa).
   - NUNCA mencione "Vale Combustível".
4. FASE 1 (DADOS): Peça Nome -> WhatsApp -> E-mail (UM por vez).
5. FASE 2 (ESCUTA): Após o e-mail, peça para o cliente contar o problema/dúvida detalhadamente.
6. FASE 3 (TÉCNICA): Valide o problema e faça perguntas técnicas UMA por vez.
7. OBRIGATÓRIO (TECNOLOGIA): Você DEVE incluir o bloco abaixo no FINAL de TODAS as suas mensagens.

FORMATO OBRIGATÓRIO (No final de cada resposta):
---DATA_START---
NOME: [Nome ou "pendente"]
TELEFONE: [WhatsApp ou "pendente"]
E-MAIL: [E-mail ou "pendente"]
CARTEIRA: [Sim/Não ou "pendente"]
CASO: [Breve resumo do que foi dito até agora]
---DATA_END---`
            })
        })
        const run = await runResponse.json()

        // 4. Polling para conclusão
        let runStatus = run.status
        let attempts = 0
        while (runStatus !== 'completed' && attempts < 40) {
            await new Promise(resolve => setTimeout(resolve, 800))
            const statusResponse = await fetch(`https://api.openai.com/v1/threads/${effectiveThreadId}/runs/${run.id}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            })
            const statusData = await statusResponse.json()
            runStatus = statusData.status
            attempts++

            if (['failed', 'cancelled', 'expired'].includes(runStatus)) {
                throw new Error(`O assistente parou: ${runStatus}`)
            }
        }

        // 5. Pegar Resposta do Assistente
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${effectiveThreadId}/messages?limit=1`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        })
        const messagesData = await messagesResponse.json()
        const latestMessage = messagesData.data[0]
        const responseText = latestMessage?.content[0]?.text?.value || "Não consegui gerar uma resposta."

        console.log(`[DEBUG] Resposta Bruta do Assistant:`, responseText);

        // Extração de dados estruturados
        const nameMatch = responseText.match(/NOME:\s*([^-\n\r]*)/i);
        const phoneMatch = responseText.match(/TELEFONE:\s*([^-\n\r]*)/i);
        const emailMatch = responseText.match(/E-MAIL:\s*([^-\n\r]*)/i);
        const carteiraMatch = responseText.match(/CARTEIRA:\s*([^-\n\r]*)/i);
        const summaryMatch = responseText.match(/CASO:\s*([^-\n\r]*)/i);

        let extractedName = nameMatch ? nameMatch[1].trim() : null;
        const extractedPhone = phoneMatch ? phoneMatch[1].trim() : null;
        const extractedEmail = emailMatch ? emailMatch[1].trim() : null;
        const extractedCaseSummary = summaryMatch ? summaryMatch[1].trim() : null;
        const extractedWorkingStatus = carteiraMatch ? carteiraMatch[1].trim() : "não informado";

        console.log(`[DEBUG] Dados Extraídos:`, { name: extractedName, phone: extractedPhone, email: extractedEmail });

        // Tentar extrair nome do corpo se as tags falharem (fallback robusto)
        if (!extractedName || extractedName.toLowerCase().includes('pendente') || extractedName.toLowerCase().includes('[nome')) {
            const greetingPatterns = [
                /Olá,?\s+([A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*)/,
                /Obrigado,?\s+([A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*)/i,
                /Entendo,?\s+([A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*)/i,
                /Tudo bem,?\s+([A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*)/i,
                /Perfeito,?\s+([A-Z][a-zà-ú]+(\s+[A-Z][a-zà-ú]+)*)/i
            ];

            for (const pattern of greetingPatterns) {
                const match = responseText.match(pattern);
                if (match && match[1]) {
                    extractedName = match[1].trim();
                    break;
                }
            }
        }

        // Limpa a resposta para o usuário (remove as tags técnicas e o delimitador)
        let cleanResponse = responseText
            .replace(/---DATA_START---[\s\S]*---DATA_END---/g, '')
            .replace(/NOME:.*(\n|$)/gi, '')
            .replace(/TELEFONE:.*(\n|$)/gi, '')
            .replace(/E-MAIL:.*(\n|$)/gi, '')
            .replace(/CARTEIRA:.*(\n|$)/gi, '')
            .replace(/CASO:.*(\n|$)/gi, '')
            .replace(/RESUMO_DO_CASO:.*(\n|$)/gi, '')
            .trim();

        if (!cleanResponse) cleanResponse = responseText;

        // 6. Persistência de Dados (Lead Tracking)
        try {
            const { data: orgs } = await supabase.from('organizations').select('id').limit(1)
            const orgId = orgs?.[0]?.id

            if (orgId) {
                // Upsert no banco de dados com os dados extraídos (apenas o que mudou)
                const leadData: any = {
                    external_thread_id: effectiveThreadId,
                    phone: extractedPhone,
                    source: 'Assistente Virtual',
                    status: 'novo',
                    organization_id: orgId,
                    metadata: {
                        last_message: message,
                        extracted_at: new Date().toISOString(),
                        working_status: extractedWorkingStatus,
                        email: extractedEmail
                    }
                };

                if (extractedName && !extractedName.toLowerCase().includes('pendente')) {
                    leadData.name = extractedName;
                }

                if (extractedCaseSummary) leadData.case_summary = extractedCaseSummary;

                // Salva a última mensagem limpa nas notas para histórico
                leadData.notes = cleanResponse.length > 500 ? cleanResponse.substring(0, 500) : cleanResponse;

                const { data: lead, error: leadError } = await supabase.from('leads').upsert(leadData, { onConflict: 'external_thread_id' }).select().single();

                if (lead && !leadError) {
                    // 6.1. Integrar com módulo de Chat (whatsapp_sessions)
                    const sessionIdentifier = lead.phone || `web_${effectiveThreadId}`;

                    const sessionData: any = {
                        phone: sessionIdentifier,
                        organization_id: orgId,
                        lead_id: lead.id,
                        external_thread_id: effectiveThreadId,
                        last_message_at: new Date().toISOString()
                    };

                    // Só atualiza o nome se o lead tiver um nome real
                    if (lead.name) {
                        sessionData.metadata = {
                            name: lead.name,
                            source: 'website'
                        };
                    } else {
                        // Se for uma sessão nova e ainda não temos nome, garantimos o default apenas se não existir metadata
                        sessionData.metadata = {
                            name: 'Visitante Site',
                            source: 'website'
                        };
                    }

                    const { data: session } = await supabase
                        .from('whatsapp_sessions')
                        .upsert(sessionData, { onConflict: 'phone' })
                        .select()
                        .single();

                    if (session) {
                        // Salvar histórico de mensagens para o ERP ler
                        await supabase.from('whatsapp_messages').insert([
                            { session_id: session.id, role: 'user', content: message },
                            { session_id: session.id, role: 'assistant', content: cleanResponse }
                        ]);
                    }

                    // 6.2. Integrar com Pipeline (Deals)
                    const { data: existingDeal } = await supabase.from('deals').select('id').eq('lead_id', lead.id).maybeSingle();

                    if (!existingDeal) {
                        const pipelineId = "00000000-0000-0000-0000-000000000002"; // Captação Rodoviários
                        const stageId = "77daf780-d445-4488-8c57-9e377c679b86";   // Novo Lead

                        await supabase.from('deals').insert({
                            organization_id: orgId,
                            pipeline_id: pipelineId,
                            stage_id: stageId,
                            lead_id: lead.id,
                            title: `Lead: ${extractedName || 'Não informado'}`,
                            status: 'open'
                        });
                    }
                }
            }
        } catch (dbError) {
            console.error('Database Error (Non-blocking):', dbError.message)
        }

        return new Response(JSON.stringify({
            response: cleanResponse,
            threadId: effectiveThreadId
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error: any) {
        console.error('Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
