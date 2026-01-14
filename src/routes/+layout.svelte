<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </div>
      <ul
        tabindex="-1"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li><a>Productos</a></li>
        <li>
          <a>Categorías</a>
          <ul class="p-2">
            <li><a>Procesadores</a></li>
            <li><a>Tarjetas Gráficas</a></li>
            <li><a>Placas Madre</a></li>
            <li><a>Memorias RAM</a></li>
            <li><a>Almacenamiento</a></li>
            <li><a>Fuentes de Poder</a></li>
            <li><a>Ver más</a></li>
          </ul>
        </li>
        <li><a>Reparaciones y servicios</a></li>
      </ul>
    </div>
    <a class="btn btn-ghost text-xl">HardTech Solutions</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a>Productos</a></li>
      <li>
        <details>
          <summary>Categorías</summary>
          <ul class="p-2 bg-base-100 w-40 z-1">
            <li><a>Procesadores</a></li>
            <li><a>Tarjetas Gráficas</a></li>
            <li><a>Placas Madre</a></li>
            <li><a>Memorias RAM</a></li>
            <li><a>Almacenamiento</a></li>
            <li><a>Fuentes de Poder</a></li>
            <li><a>Ver más</a></li>
          </ul>
        </details>
      </li>
      <li><a>Reparaciones y servicios</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <div class="flex-none gap-2">
      <ThemeSwitcher />
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="badge badge-sm indicator-item">8</span>
          </div>
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          tabindex="0"
          class="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
        >
          <div class="card-body">
            <span class="text-lg font-bold">8 Productos</span>
            <span class="text-primary">Subtotal: $67</span>
            <div class="card-actions">
              <button class="btn btn-primary btn-block">Ver carrito</button>
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <!-- svelte-ignore a11y_missing_attribute -->
            <a class="justify-between">
              Perfil
              <span class="badge">Nuevo</span>
            </a>
          </li>
          <!-- svelte-ignore a11y_missing_attribute -->
          <li><a>Configuración</a></li>
          <!-- svelte-ignore a11y_missing_attribute -->
          <li><a>Cerrar sesión</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

{@render children()}

<footer class="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
  <nav>
    <h6 class="footer-title">Servicios y planes</h6>
    <a class="link link-hover">Productos</a>
    <a class="link link-hover">Servicios</a>
    <a class="link link-hover">Sponsors</a>
  </nav>
  <nav>
    <h6 class="footer-title">Compañía</h6>
    <a class="link link-hover">Sobre Nosotros</a>
    <a class="link link-hover">Contacto</a>
    <a class="link link-hover">Empleos</a>
  </nav>
  <nav>
    <h6 class="footer-title">Social</h6>
    <div class="grid grid-flow-col gap-4">
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
          ></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
          ></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
          ></path>
        </svg>
      </a>
    </div>
  </nav>
</footer>
