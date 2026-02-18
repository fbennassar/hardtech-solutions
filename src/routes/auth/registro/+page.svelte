<script lang="ts">
  import { enhance } from "$app/forms";

  let { form } = $props();
  let loading = $state(false);
  let showSuccessModal = $state(false);

  // 1. Inicializamos la variable de estado "limpia", SIN referenciar a `form`.
  // Esto hace que el compilador deje de quejarse de inmediato.
  let selectedAccountType = $state("personal");

  // 2. Usamos $effect para atrapar cualquier dato que devuelva el servidor
  // (por ejemplo, si el formulario falla y queremos que el select mantenga
  // la opción "business" que el usuario había elegido).
  $effect(() => {
    if (form && typeof form.accountType === 'string') {
      selectedAccountType = form.accountType;
    }
  });
</script>

<h2 class="card-title mb-6 justify-center text-center text-2xl font-bold">
  Crear Cuenta
</h2>

<form
  method="POST"
  use:enhance={() => {
    loading = true;
    return async ({ result, update }) => {
      loading = false;
      if (result.type === "success") {
        showSuccessModal = true;
      }
      await update();
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
    <label class="label" for="fullName">
      <span class="label-text">Nombre Completo</span>
    </label>
    <input
      type="text"
      name="fullName"
      id="fullName"
      placeholder="Juan Pérez"
      class="input input-bordered w-full"
      value={form?.fullName ?? ""}
      required
    />
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="form-control">
      <label class="label" for="phone">
        <span class="label-text">Teléfono</span>
      </label>
      <input
        type="tel"
        name="phone"
        id="phone"
        placeholder="+56 9 1234 5678"
        class="input input-bordered w-full"
        value={form?.phone ?? ""}
        required
      />
    </div>

    <div class="form-control">
      <label class="label" for="accountType">
        <span class="label-text">Tipo de Cuenta</span>
      </label>
      <select
        name="accountType"
        id="accountType"
        class="select select-bordered w-full"
        bind:value={selectedAccountType}
      >
        <option value="personal">Personal</option>
        <option value="business">Empresarial</option>
      </select>
    </div>

    {#if selectedAccountType === "business"}
      <div class="flex flex-col gap-4 border-t border-base-300 pt-4">
        <h3 class="text-lg font-semibold text-primary">Datos de la Empresa</h3>
        <div class="form-control">
          <label class="label" for="businessName">
            <span class="label-text">Razón Social</span>
          </label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            placeholder="HardTech Solutions SpA"
            class="input input-bordered w-full"
            required={selectedAccountType === "business"}
          />
        </div>
        <div class="form-control">
          <label class="label" for="rif">
            <span class="label-text">RIF</span>
          </label>
          <input
            type="text"
            name="rif"
            id="rif"
            placeholder="J-12345678-9"
            class="input input-bordered w-full"
            required={selectedAccountType === "business"}
          />
        </div>
        <div class="form-control">
          <label class="label" for="businessAddress">
            <span class="label-text">Dirección</span>
          </label>
          <input
            type="text"
            name="businessAddress"
            id="businessAddress"
            placeholder="Av. Siempre Viva 742"
            class="input input-bordered w-full"
            required={selectedAccountType === "business"}
          />
        </div>
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
        placeholder="tu@email.com"
        class="input input-bordered"
        value={form?.email ?? ""}
        required
      />
    </div>

    <div class="form-control">
      <label class="label" for="password">
        <span class="label-text">Ingrese su Contraseña</span>
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

    <div class="form-control">
      <label class="label" for="confirmPassword">
        <span class="label-text">Confirmar Contraseña</span>
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="••••••••"
        class="input input-bordered"
        required
      />
    </div>

    <div class="form-control mt-6">
      <button class="btn btn-primary" disabled={loading}>
        {#if loading}
          <span class="loading loading-spinner"></span>
        {/if}
        Registrarse
      </button>
    </div>

    <div class="mt-4 text-center text-sm">
      ¿Ya tienes cuenta? <a href="/auth/login" class="link link-primary"
        >Inicia sesión</a
      >
    </div>
  </div>
</form>

{#if showSuccessModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-success">¡Registro Exitoso!</h3>
      <p class="py-4">
        Hemos enviado un correo de confirmación a tu dirección de email.
        <br /><br />
        Por favor, revisa tu bandeja de entrada (y spam) para activar tu cuenta antes
        de iniciar sesión.
      </p>
      <div class="modal-action">
        <a href="/auth/login" class="btn btn-primary">Ir a Iniciar Sesión</a>
      </div>
    </div>
    <div class="modal-backdrop bg-black/50"></div>
  </div>
{/if}
