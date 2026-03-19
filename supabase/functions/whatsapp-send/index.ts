import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { phone, message, threadId } = await req.json()

        const apiKey = Deno.env.get('OPENAI_API_KEY')
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const whatsappToken = Deno.env.get('WHATSAPP_TOKEN')
        const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

        if (!whatsappToken || !phoneNumberId) {
            throw new Error('Configuração do WhatsApp Cloud API ausente (Token ou Phone Number ID)')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const waResp = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${whatsappToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phone,
                type: "text",
                text: { body: message }
            })
        })

        if (!waResp.ok) {
            const error = await waResp.json()
            throw new Error(`WhatsApp API Error: ${JSON.stringify(error)}`)
        }

        const { data: session } = await supabase
            .from('whatsapp_sessions')
            .select('id')
            .eq('phone', phone)
            .maybeSingle()

        if (session) {
            await supabase.from('whatsapp_messages').insert({
                session_id: session.id,
                role: 'assistant',
                content: message
            })

            await supabase.from('whatsapp_sessions').update({
                last_message_at: new Date().toISOString(),
                is_ai_active: false
            }).eq('id', session.id)
        }

        if (threadId && apiKey) {
            await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'OpenAI-Beta': 'assistants=v2' },
                body: JSON.stringify({ role: 'assistant', content: `[RESPOSTA MANUAL DO ADVOGADO]: ${message}` })
            })
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (e: any) {
        console.error('Send Error:', e.message)
        return new Response(JSON.stringify({ error: e.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
