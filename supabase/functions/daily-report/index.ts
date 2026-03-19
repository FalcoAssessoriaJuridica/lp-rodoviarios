import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 1. Buscar leads das últimas 24 horas
        const yesterday = new Date()
        yesterday.setHours(yesterday.getHours() - 24)

        const { data: leads, error: leadsError } = await supabase
            .from('leads')
            .select(`
                id,
                name,
                phone,
                created_at,
                case_summary,
                metadata
            `)
            .gte('created_at', yesterday.toISOString())
            .order('created_at', { ascending: false })

        if (leadsError) throw leadsError

        if (!leads || leads.length === 0) {
            return new Response(JSON.stringify({ message: 'Nenhum lead encontrado nas últimas 24h.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // 2. Formatar o relatório em HTML
        let leadsHtml = leads.map(lead => {
            const date = new Date(lead.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            const workingStatus = lead.metadata?.working_status || 'Não informado'

            return `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
                    <h3 style="margin: 0 0 10px 0; color: #1e293b;">${lead.name || 'Sem nome'}</h3>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>WhatsApp:</strong> ${lead.phone || '—'}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Data:</strong> ${date}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Status de Trabalho:</strong> ${workingStatus}</p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;"><strong>Resumo:</strong><br>${lead.case_summary || '—'}</p>
                </div>
            `
        }).join('')

        const html = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #c2a353; border-bottom: 2px solid #c2a353; padding-bottom: 10px;">Relatório Diário de Leads</h2>
                <p>Olá Dr. Roberto, aqui estão os leads capturados nas últimas 24 horas:</p>
                ${leadsHtml}
                <footer style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
                    Gerado automaticamente pelo Antigravity CRM
                </footer>
            </body>
            </html>
        `

        // 3. Enviar via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${RESEND_API_KEY}\`
            },
            body: JSON.stringify({
                from: 'Falco CRM <onboarding@resend.dev>',
                to: 'falco.adv@gmail.com',
                subject: \`Relatório de Leads - \${new Date().toLocaleDateString('pt-BR')}\`,
                html: html,
            }),
        })

        const resData = await res.json()
        if (!res.ok) throw new Error(JSON.stringify(resData))

        return new Response(JSON.stringify({ success: true, data: resData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Erro na função daily-report:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
