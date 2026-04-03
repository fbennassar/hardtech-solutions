import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { guia } = params;

    const { data: repair, error: fetchError } = await supabase
        .from('repairs')
        .select('*')
        .eq('tracking_code', guia)
        .single();

    if (fetchError || !repair) {
        throw error(404, { message: 'Guía de reparación no encontrada. Verifica que el código esté escrito correctamente.' });
    }

    return {
        repair
    };
};
