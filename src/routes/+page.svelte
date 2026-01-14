<script lang="ts">
  import "../app.css";
  import { Cpu, Gpu, HardDrive, Mouse, Search } from "lucide-svelte";
  import heroVideo from "$lib/assets/home/loop.mov";
  import cpuImage from "$lib/assets/home/CPU.png";
  import gpuImage from "$lib/assets/home/GPU.png";
  import perifericoImage from "$lib/assets/home/periferico.png";
  import almacenamientoImage from "$lib/assets/home/almacenamiento.png";
  import B2BImage from "$lib/assets/home/B2B.webp";
  import { onMount } from "svelte";

  let buscadorSection: HTMLElement;

  function scrollToBuscador() {
    buscadorSection?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Lógica para animaciones al hacer scroll (Intersection Observer)

  function reveal(node: Element) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("animate-enter");
            observer.unobserve(node); // Solo anima una vez
          }
        });
      },
      { threshold: 0.1 }
    ); // Se activa cuando se ve el 10% del elemento

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }
</script>

<div class="flex flex-col gap-16 md:gap-24">
  <!-- Hero Section -->
  <div class="hero relative min-h-[75vh] overflow-hidden">
    <video
      class="absolute inset-0 h-full w-full object-cover opacity-20 md:opacity-40"
      autoplay
      loop
      muted
      playsinline
    >
      <source src={heroVideo} type="video/mp4" />
    </video>
    <div class="hero-overlay bg-black bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-2xl">
        <h1 class="text-4xl font-bold sm:text-6xl">
          Potencia tu <span class="text-primary">Setup</span>, Repara tu
          <span class="text-primary">Equipo</span>
        </h1>
        <p class="py-6 text-lg">
          Los mejores componentes de PC y el servicio técnico más transparente
          de la ciudad.
        </p>
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button class="btn btn-primary">Ver Catálogo</button>
          <button
            class="btn btn-secondary btn-outline"
            on:click={scrollToBuscador}
          >
            Rastrear Reparación
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Buscador Rápido de Reparaciones -->
  <div
    bind:this={buscadorSection}
    class="bg-base-200 py-16 sm:py-20 scroll-mt-20"
  >
    <div
      class="container mx-auto flex flex-col items-center gap-6 px-4 text-center"
    >
      <h2 class="text-3xl font-bold">
        ¿Tienes un equipo en nuestro <span class="text-primary">taller</span>?
      </h2>
      <div class="join w-full max-w-lg">
        <div class="relative w-full">
          <input
            id="buscador-orden"
            type="text"
            placeholder="Ingresa tu número de orden"
            class="input join-item input-bordered w-full pl-10 transition-all duration-300 focus:ring-4 focus:ring-primary/50"
          />
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Search class="h-5 w-5 text-base-content/50" />
          </div>
        </div>
        <button class="btn btn-primary join-item hover:scale-105"
          >Rastrear</button
        >
      </div>
    </div>
  </div>

  <!-- Categorías Destacadas -->
  <div class="container mx-auto px-4">
    <h2 class="mb-8 text-center text-3xl font-bold">
      Categorías <span class="text-primary">Destacadas</span>
    </h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Procesadores -->
      <div
        class="card card-compact border-2 border-transparent bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
      >
        <figure
          class="relative w-full aspect-square bg-white overflow-hidden rounded-t-xl flex items-center justify-center p-4"
        >
          <img
            src={cpuImage}
            alt="Procesadores"
            class="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
          />
        </figure>
        <div class="card-body">
          <h3 class="card-title">
            <Cpu class="h-6 w-6" />
            Procesadores
          </h3>
          <p>El cerebro de tu máquina, a la máxima potencia.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Ver más</button>
          </div>
        </div>
      </div>
      <!-- Gráficas -->
      <div
        class="card card-compact border-2 border-transparent bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
      >
        <figure
          class="relative w-full aspect-square bg-white overflow-hidden rounded-t-xl flex items-center justify-center p-4"
        >
          <img src={gpuImage} alt="Tarjetas Gráficas" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">
            <Gpu class="h-6 w-6" />
            Tarjetas Gráficas
          </h3>
          <p>Visuales impresionantes para tus juegos y proyectos.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Ver más</button>
          </div>
        </div>
      </div>
      <!-- Periféricos -->
      <div
        class="card card-compact border-2 border-transparent bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
      >
        <figure class="relative w-full aspect-square bg-white overflow-hidden rounded-t-xl flex items-center justify-center p-4">
          <img
            src={perifericoImage}
            alt="Periféricos"
          />
        </figure>
        <div class="card-body">
          <h3 class="card-title">
            <Mouse class="h-6 w-6" />
            Periféricos
          </h3>
          <p>Precisión y comodidad para dominar cada partida.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Ver más</button>
          </div>
        </div>
      </div>
      <!-- Almacenamiento -->
      <div
        class="card card-compact border-2 border-transparent bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
      >
        <figure class="relative w-full aspect-square bg-white overflow-hidden rounded-t-xl flex items-center justify-center p-4">
          <img
            src={almacenamientoImage}
            alt="Almacenamiento"
          />
        </figure>
        <div class="card-body">
          <h3 class="card-title">
            <HardDrive class="h-6 w-6" />
            Almacenamiento
          </h3>
          <p>Velocidad de carga ultrarrápida para tus juegos y archivos.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Ver más</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Por qué elegirnos (Stats) -->
  <div class="container mx-auto px-4 py-10">
    <div class="stats stats-vertical w-full shadow-lg md:stats-horizontal">
      <div class="stat">
        <div class="stat-title">Equipos Reparados</div>
        <div class="stat-value text-primary">1,200+</div>
        <div class="stat-desc">Con la máxima satisfacción</div>
      </div>

      <div class="stat">
        <div class="stat-title">Componentes Vendidos</div>
        <div class="stat-value text-secondary">4,600+</div>
        <div class="stat-desc">Las mejores marcas del mercado</div>
      </div>

      <div class="stat">
        <div class="stat-title">Garantía Asegurada</div>
        <div class="stat-value">100%</div>
        <div class="stat-desc">En todos nuestros servicios y productos</div>
      </div>
    </div>
  </div>

  <!-- Soluciones Empresariales (B2B) -->
  <div use:reveal class="reveal-hidden bg-base-200 py-20">
    <div class="container mx-auto px-4">
      <div class="text-center">
        <h2 class="text-3xl font-bold">
          Soluciones para tu <span class="text-primary">Empresa</span>
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg">
          Mantenemos la infraestructura tecnológica de tu negocio funcionando a
          la perfección.
        </p>
      </div>
      <div class="mt-12 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div class="order-2 md:order-1">
          <ul class="flex flex-col gap-6">
            <li class="flex items-start gap-4">
              <div class="mt-1 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-8 w-8 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold">Mantenimiento Preventivo</h3>
                <p class="mt-1 text-base-content/80">
                  Planes a medida para oficinas y locales comerciales,
                  asegurando la continuidad de tu operación.
                </p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="mt-1 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-8 w-8 text-primary"
                >
                  <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
                  <line x1="6" x2="6.01" y1="6" y2="6" />
                  <line x1="6" x2="6.01" y1="18" y2="18" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold">
                  Montaje de Servidores y Redes
                </h3>
                <p class="mt-1 text-base-content/80">
                  Instalación y configuración de servidores, racks y redes
                  cableadas para un rendimiento óptimo.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="order-1 md:order-2">
          <img
            src={B2BImage}
            alt="Servicios para empresas"
            class="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Ofertas Flash -->
  <div class="container mx-auto px-4 py-20">
    <div class="text-center">
      <h2 class="text-3xl font-bold">
        Ofertas <span class="text-primary">Flash</span>
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg">
        Aprovecha nuestras promociones por tiempo limitado.
      </p>
    </div>
    <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Card Oferta 1 -->
      <div
        use:reveal
        class="reveal-hidden card image-full bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl"
      >
        <div class="card-body items-center justify-center text-center">
          <h3 class="card-title text-3xl font-bold">¡Atención Estudiantes!</h3>
          <p class="text-lg">
            15% de descuento en servicios de reparación presentando tu
            credencial.
          </p>
          <div class="card-actions mt-4">
            <button
              class="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
              >Saber más</button
            >
          </div>
        </div>
      </div>
      <!-- Card Oferta 2 -->
      <div
        use:reveal
        class="reveal-hidden card image-full bg-gradient-to-tr from-accent to-primary text-primary-content shadow-xl"
      >
        <div class="card-body items-center justify-center text-center">
          <h3 class="card-title text-3xl font-bold">
            Upgrade y Limpieza Gratis
          </h3>
          <p class="text-lg">
            Al comprar una nueva tarjeta gráfica o procesador, ¡la limpieza
            interna de tu PC va por nuestra cuenta!
          </p>
          <div class="card-actions mt-4">
            <button
              class="btn btn-outline border-white text-white hover:bg-white hover:text-accent"
              >Ver Componentes</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Contacto / CTA Final -->
  <div use:reveal class="reveal-hidden bg-base-200 py-20">
    <div
      class="container mx-auto flex flex-col items-center gap-8 px-4 text-center"
    >
      <h2 class="text-3xl font-bold">¿Listo para empezar?</h2>
      <p class="max-w-xl text-lg">
        Ponte en contacto con nosotros. Nuestro equipo está listo para ayudarte
        con tus dudas y proyectos.
      </p>
      <div class="mt-4 flex flex-wrap justify-center gap-8">
        <a
          href="/"
          class="flex flex-col items-center gap-2 transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-12 w-12 text-success"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          <span class="font-semibold">WhatsApp</span>
        </a>
        <a
          href="/"
          class="flex flex-col items-center gap-2 transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-12 w-12 text-info"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span class="font-semibold">Email</span>
        </a>
        <a
          href="/"
          class="flex flex-col items-center gap-2 transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-12 w-12 text-error"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span class="font-semibold">Ubicación</span>
        </a>
      </div>
      <div class="mt-8">
        <button class="btn btn-primary btn-lg">Solicitar Cotización</button>
      </div>
    </div>
  </div>
</div>
