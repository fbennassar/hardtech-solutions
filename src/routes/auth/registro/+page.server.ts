import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const fullName = formData.get('fullName') as string;
		const phone = formData.get('phone') as string;
		const accountType = formData.get('accountType') as string;
		const businessName = formData.get('businessName') as string;
		const businessAddress = formData.get('businessAddress') as string;
		const rif = formData.get('rif') as string;

		if (!email || !password || !confirmPassword || !fullName || !phone || !accountType) {
			return fail(400, { error: 'Todos los campos son obligatorios', email, fullName, phone, accountType });
		}

		if (accountType === 'business' && (!businessName || !businessAddress || !rif)) {
			return fail(400, {
				error: 'Para cuentas de empresa, la Razón Social, Dirección y RIF son obligatorias.',
				email, fullName, phone, accountType, businessName, businessAddress, rif
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Las contraseñas no coinciden', email, fullName, phone, accountType });
		}

		if (password.length < 6) {
			return fail(400, {
				error: 'La contraseña debe tener al menos 6 caracteres',
				email, fullName, phone, accountType
			});
		}

		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/login`,
				data: {
					full_name: fullName,
					phone,
					account_type: accountType
				}
			}
		});

		if (signUpError) {
			return fail(400, { error: signUpError.message, email, fullName, phone, accountType });
		}

		// Si el registro fue exitoso y es una cuenta de empresa, insertamos en la tabla 'companies'
		if (signUpData.user && accountType === 'business') {
			const { error: companyError } = await supabase.from('companies').insert({
				user_id: signUpData.user.id,
				company_name: businessName,
				address: businessAddress,
				rif,
				business_phone: phone // Usamos el mismo teléfono por simplicidad, podría ser otro campo.
			});

			if (companyError) {
				// Nota: El usuario ya fue creado. En un escenario de producción robusto,
				// se debería manejar este caso, por ejemplo, eliminando al usuario recién creado
				// o usando una función de base de datos para una operación atómica (transacción).
				console.error('Error creating company profile:', companyError);
				return fail(500, { error: 'Se creó el usuario, pero hubo un error al crear el perfil de empresa.', email, fullName, phone, accountType, businessName, businessAddress, rif });
			}
		}

		return { success: true };
	}
};