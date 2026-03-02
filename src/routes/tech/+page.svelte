<script lang="ts">
  let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
  <div class="card bg-base-100 shadow-xl border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        ¡Hola <span class="text-secondary">Técnico</span>!
      </h2>
      <p class="text-base-content/80">
        Bienvenido al panel técnico de HardTech Solutions.
      </p>
      <div class="alert alert-info mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Acceso verificado como: {data.userRole}</span>
      </div>
    </div>
  </div>
</div>
