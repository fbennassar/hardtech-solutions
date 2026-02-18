import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Por favor ingresa tu email y contraseña', email });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			// Traducir mensaje de error común
			let message = error.message;
			if (error.message === 'Invalid login credentials') {
				message = 'Credenciales inválidas. Verifica tu correo y contraseña.';
			}
			
			return fail(400, { error: message, email });
		}

		redirect(303, '/');
	}
};