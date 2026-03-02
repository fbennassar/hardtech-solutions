<script lang="ts">
  let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
  <div class="card bg-base-100 shadow-xl border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        ¡Hola <span class="text-primary">Admin</span>!
      </h2>
      <p class="text-base-content/80">
        Bienvenido al panel de administración de HardTech Solutions.
      </p>
      <div class="alert alert-success mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Acceso verificado como: {data.userRole}</span>
      </div>
    </div>
  </div>
</div>
