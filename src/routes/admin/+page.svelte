<script lang="ts">
  import { Package, Tags, Wrench } from "lucide-svelte";
  let { data } = $props();
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-6">
  <div>
    <h1 class="text-3xl font-bold">
      ¡Hola <span class="text-primary">Admin</span>!
    </h1>
    <p class="text-base-content/80 mt-2">
      Bienvenido al panel de administración de HardTech Solutions.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
    <!-- Products Card -->
    <a
      href="/admin/productos"
      class="card bg-base-300 shadow-xl border border-base-200 hover:shadow-2xl transition-all hover:border-primary group"
    >
      <div class="card-body flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors"
          >
            <Package class="h-8 w-8" />
          </div>
          <h2 class="card-title text-2xl">Productos</h2>
        </div>
        <p class="text-base-content/70 grow">
          Gestiona el inventario, actualiza stock, precios y las imágenes de los
          productos de la tienda.
        </p>
        <div class="card-actions justify-end mt-4">
          <span class="btn btn-success btn-sm">Gestionar</span>
        </div>
      </div>
    </a>

    <!-- Categories Card -->
    <a
      href="/admin/categorias"
      class="card bg-base-300 shadow-xl border border-base-200 hover:shadow-2xl transition-all hover:border-secondary group"
    >
      <div class="card-body flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="p-3 bg-secondary/10 rounded-xl text-secondary group-hover:bg-secondary group-hover:text-secondary-content transition-colors"
          >
            <Tags class="h-8 w-8" />
          </div>
          <h2 class="card-title text-2xl">Categorías</h2>
        </div>
        <p class="text-base-content/70 grow">
          Organiza los productos de la tienda creando y editando las categorías
          principales.
        </p>
        <div class="card-actions justify-end mt-4">
          <span class="btn btn-success btn-sm">Gestionar</span>
        </div>
      </div>
    </a>
    
    <!-- Repairs Card -->
    <a
      href="/admin/reparaciones"
      class="card bg-base-300 shadow-xl border border-base-200 hover:shadow-2xl transition-all hover:border-accent group"
    >
      <div class="card-body flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-accent-content transition-colors"
          >
            <Wrench class="h-8 w-8" />
          </div>
          <h2 class="card-title text-2xl">Reparaciones</h2>
        </div>
        <p class="text-base-content/70 grow">
          Registra y actualiza el estado de las reparaciones de equipos de los clientes.
        </p>
        <div class="card-actions justify-end mt-4">
          <span class="btn btn-success btn-sm">Gestionar</span>
        </div>
      </div>
    </a>
  </div>
</div>
