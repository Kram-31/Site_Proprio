export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const project = data.get('project') as string;
        const budget = data.get('budget') as string;
        const placement = data.get('placement') as string;
        const availability = data.get('availability') as string;

        // VALIDATION BASIC
        if (!name || !email || !project) {
            return new Response(JSON.stringify({
                message: 'Champs manquants'
            }), { status: 400 });
        }

        // Insert into Supabase
        const { data: booking, error: dbError } = await supabase
            .from('bookings')
            .insert({
                client_name: name,
                email: email,
                project_desc: project,
                availability: availability || new Date().toISOString().split('T')[0],
                status: 'new',
                created_at: new Date().toISOString(),
                budget: budget,
                placement: placement,
                notes: `Envoyé depuis le site web.`
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database Error:', dbError);
            return new Response(JSON.stringify({
                message: `Erreur SGBD: ${dbError.message || dbError.details || 'Inconnue'}`
            }), { status: 500 });
        }

        console.log(`[EMAIL SIMULATION] Sending email to artist about ${name}`);

        // Success
        return new Response(JSON.stringify({
            message: "Demande envoyée avec succès ! Je vous recontacte rapidement.",
            bookingId: booking.id
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return new Response(JSON.stringify({ message: "Erreur interne du serveur." }), { status: 500 });
    }
}
