<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<h2 class="card-title mb-6 justify-center text-center text-2xl font-bold">Iniciar Sesión</h2>

<form
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
	class="flex flex-col gap-4"
>
	{#if form?.error}
		<div role="alert" class="alert alert-error py-2 text-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{form.error}</span>
		</div>
	{/if}

	<div class="form-control">
		<label class="label" for="email">
			<span class="label-text">Ingrese su Email</span>
		</label>
		<input
			type="email"
			name="email"
			id="email"
			placeholder="ejemplo123@email.com"
			class="input input-bordered"
			value={form?.email ?? ''}
			required
		/>
	</div>

	<div class="form-control">
		<label class="label" for="password">
			<span class="label-text">Ingrese su contraseña</span>
		</label>
		<input
			type="password"
			name="password"
			id="password"
			placeholder="••••••••"
			class="input input-bordered"
			required
		/>
	</div>

	<div class="form-control mt-6">
		<button class="btn btn-success" disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner"></span>
			{/if}
			Ingresar
		</button>
	</div>

	<div class="mt-4 text-center text-sm">
		¿No tienes cuenta? <a href="/auth/registro" class="link link-primary">Regístrate aquí</a>
	</div>
</form>