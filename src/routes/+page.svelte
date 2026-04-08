<script lang="ts">
  import "../app.css";
  import { Search, MapPin, Clock, Wrench, ShieldCheck, Zap, Monitor, Laptop, Cpu, HardDrive, Mail } from "lucide-svelte";
  import heroVideo from "$lib/assets/home/loop.webm";
  import laboratorioImage from "$lib/assets/home/laboratorio-tecnico.jpg";
  import cpuImage from "$lib/assets/home/CPU.webp";
  import gpuImage from "$lib/assets/home/GPU.webp";
  import perifericoImage from "$lib/assets/home/periferico.webp";
  import almacenamientoImage from "$lib/assets/home/almacenamiento.webp";
  import CategoryCard from "$lib/components/CategoryCard.svelte";
  import { goto } from '$app/navigation';

  let buscadorSection: HTMLElement;
  let trackingInput = $state("");

  function handleRastrear(e: Event) {
    e.preventDefault();
    if (trackingInput.trim()) {
      goto(`/reparaciones/${trackingInput.trim()}`);
    }
  }

  function scrollToBuscador() {
    buscadorSection?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function reveal(node: Element) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("animate-enter");
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }
</script>

<svelte:head>
  <title>HardTech Solutions | Expertos en Hardware y Reparaciones</title>
  <meta name="description" content="Venta de componentes de PC y servicio técnico especializado en Maracaibo. Reparamos GPUs, Placas Base y más." />
</svelte:head>

<div class="flex flex-col gap-20 md:gap-32 overflow-hidden">
  <!-- Hero Section Mejorada -->
  <section class="relative min-h-[90vh] flex items-center pt-20 md:pt-0">
    <div class="absolute inset-0 z-0">
      <video
        class="h-full w-full object-cover opacity-30 grayscale"
        autoplay
        loop
        muted
        playsinline
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-linear-to-b from-base-100/50 via-base-100 to-base-100"></div>
    </div>

    <div class="container mx-auto px-4 z-10 relative">
      <div class="max-w-4xl">
        <div use:reveal class="reveal-hidden inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-success text-sm font-bold mb-8 uppercase tracking-widest">
           <Zap class="w-4 h-4" /> El Taller No. 1 de Maracaibo
        </div>
        <h1 use:reveal class="reveal-hidden text-6xl md:text-8xl font-black text-base-content leading-[1.1] mb-8" style="transition-delay: 100ms">
          Hardware Con <span class="text-transparent bg-clip-text bg-gradient-to-r from-success to-primary">Propósito.</span>
        </h1>
        <p use:reveal class="reveal-hidden text-xl md:text-2xl text-base-content/60 max-w-2xl mb-12" style="transition-delay: 200ms">
          Elevamos el rendimiento de tu PC con los mejores componentes y garantizamos su vida útil con nuestro servicio técnico especializado.
        </p>

        <div use:reveal class="reveal-hidden flex flex-col sm:flex-row gap-6" style="transition-delay: 300ms">
          <a href="/productos" class="btn btn-success btn-lg px-12 rounded-2xl shadow-xl shadow-success/20">
            Explorar Catálogo
          </a>
          <button
            onclick={scrollToBuscador}
            class="btn btn-outline btn-lg px-12 rounded-2xl border-2 hover:bg-base-content hover:text-base-100"
          >
            Rastrear Equipo
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Buscador de Reparaciones Glassmorphism -->
  <section bind:this={buscadorSection} class="container mx-auto px-4 scroll-mt-32">
    <div use:reveal class="reveal-hidden bg-base-200 border border-base-300 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-64 h-64 bg-success/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-success/20 transition-all duration-700"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="text-center md:text-left flex-1">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Estado del <span class="text-success">Taller</span></h2>
          <p class="text-base-content/60 text-lg">Ingresa tu número de guía para conocer el progreso en tiempo real de tu reparación.</p>
        </div>

        <form onsubmit={handleRastrear} class="w-full md:w-auto flex-1 max-w-lg relative">
          <div class="join w-full shadow-lg">
            <input
              type="text"
              bind:value={trackingInput}
              placeholder="Ej: HT-9921"
              class="input join-item input-bordered w-full h-16 bg-base-100 placeholder:opacity-40 font-mono tracking-widest text-lg"
            />
            <button type="submit" class="btn btn-success join-item h-16 px-8 text-lg">
              <Search class="w-6 h-6" />
            </button>
          </div>
          <div class="mt-4 flex gap-4 text-xs font-semibold opacity-40 justify-center md:justify-start">
             <span>✓ Diagnóstico</span>
             <span>✓ Reparación</span>
             <span>✓ Entrega</span>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- Categorías de Componentes Grid Moderno -->
  <section class="container mx-auto px-4 mb-10">
    <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
      <div use:reveal class="reveal-hidden">
        <h2 class="text-4xl font-bold mb-4">Todo lo que tu <span class="text-success">Setup</span> necesita</h2>
        <p class="text-base-content/60 text-lg">Software, Hardware y Periféricos rigurosamente seleccionados.</p>
      </div>
      <a use:reveal href="/productos" class="reveal-hidden btn btn-ghost btn-sm group" style="transition-delay: 200ms">
        Ver todas las categorías 
        <Zap class="w-4 h-4 ml-2 group-hover:fill-success transition-all" />
      </a>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <CategoryCard
        image={cpuImage}
        title="Procesadores"
        description="El cerebro de tu máquina, directo desde Intel y AMD."
        link="/categorias/procesadores"
      />
      <CategoryCard
        image={gpuImage}
        title="Gráficas"
        description="FPS máximos con la serie RTX y Radeon RX."
        link="/categorias/tarjetas-graficas"
      />
      <CategoryCard
        image={perifericoImage}
        title="Periféricos"
        description="Ecosistema completo: teclados, mouses y audífonos."
        link="/productos"      
      />
      <CategoryCard
        image={almacenamientoImage}
        title="Almacenamiento"
        description="Velocidades NVMe para cargas instantáneas."
        link="/categorias/almacenamiento"
      />
    </div>
  </section>

  <!-- Especialistas en Reparaciones (Reemplaza B2B) -->
  <section class="bg-base-200 py-32 relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div use:reveal class="reveal-hidden">
          <h2 class="text-5xl font-bold mb-8 leading-tight">Revivimos el hardware <br/> que otros dan por <span class="text-success">perdido.</span></h2>
          <p class="text-xl text-base-content/70 mb-12">En HardTech Solutions contamos con laboratorios especializados para micro-soldadura y reparaciones de alta complejidad.</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div class="flex gap-4">
              <div class="bg-base-100 p-3 rounded-xl shadow-lg h-fit"><Cpu class="w-6 h-6 text-success" /></div>
              <div>
                <h4 class="font-bold mb-1">Reparación de GPUs</h4>
                <p class="text-sm text-base-content/60">Reballing, cambio de VRAM y fases de poder.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="bg-base-100 p-3 rounded-xl shadow-lg h-fit"><HardDrive class="w-6 h-6 text-success" /></div>
              <div>
                <h4 class="font-bold mb-1">Placas Madre</h4>
                <p class="text-sm text-base-content/60">Cortos circuitos, BIOS corruptas y puertos dañados.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="bg-base-100 p-3 rounded-xl shadow-lg h-fit"><Monitor class="w-6 h-6 text-success" /></div>
              <div>
                <h4 class="font-bold mb-1">Mantenimiento</h4>
                <p class="text-sm text-base-content/60">Limpieza profunda y cambio de pasta térmica premium.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="bg-base-100 p-3 rounded-xl shadow-lg h-fit"><Laptop class="w-6 h-6 text-success" /></div>
              <div>
                <h4 class="font-bold mb-1">Laptops Gamer</h4>
                <p class="text-sm text-base-content/60">Optimización de sistema y reparación de bisagras.</p>
              </div>
            </div>
          </div>
        </div>

        <div use:reveal class="reveal-hidden relative" style="transition-delay: 200ms">
           <div class="aspect-video bg-base-300 rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src={laboratorioImage} alt="Laboratorio Técnico" class="w-full h-full object-cover" />
           </div>
           <div class="absolute -bottom-10 -left-10 bg-base-100 p-8 rounded-3xl shadow-2xl border border-base-300 hidden md:block">
              <div class="flex items-center gap-4">
                 <div class="text-3xl font-bold text-success">100%</div>
                 <div class="text-xs uppercase font-black opacity-50">Tasa de <br/> Transparencia</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Horarios y Ubicación (Reemplaza Ofertas) -->
  <section class="container mx-auto px-4 py-10">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <!-- Card Ubicación Maracaibo -->
      <div use:reveal class="reveal-hidden bg-base-100 border-[6px] border-success p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-success/5 rounded-full"></div>
        
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center text-success">
            <MapPin class="w-6 h-6" />
          </div>
          <h3 class="text-3xl font-extrabold uppercase tracking-tight">Estamos en <span class="text-success">Maracaibo</span></h3>
        </div>
        
        <p class="text-xl text-base-content/70 leading-relaxed mb-10">
          Nuestra sede principal se encuentra en el vibrante corazón de Maracaibo. Visítanos para asesoría técnica personalizada o recolección de equipos.
        </p>
        
        <div class="flex flex-col gap-4 text-lg font-bold">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-success"></div>
            <span>Sector Indio Mara, Av. 15</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-success"></div>
            <span>C.C. Metrosol, Nivel PB</span>
          </div>
        </div>

        <div class="mt-12 flex flex-wrap gap-4 relative z-10">
           <button class="btn btn-success rounded-xl">¿Cómo llegar?</button>
           <button class="btn btn-ghost rounded-xl">Contactar Sede</button>
        </div>
      </div>

      <!-- Card Horarios -->
      <div use:reveal class="reveal-hidden bg-base-200 p-10 md:p-12 rounded-[2.5rem] border border-base-300 flex flex-col justify-between" style="transition-delay: 200ms">
        <div>
          <div class="flex items-center gap-4 mb-10">
            <div class="w-12 h-12 bg-base-100 rounded-2xl flex items-center justify-center text-primary shadow-md">
              <Clock class="w-6 h-6" />
            </div>
            <h3 class="text-3xl font-bold">Horarios de Atención</h3>
          </div>

          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300/50">
              <span class="font-bold text-lg">Lunes a Viernes</span>
              <span class="badge badge-success badge-lg font-bold h-auto py-2 text-center">9:00 AM - 6:30 PM</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 bg-base-100 p-5 rounded-2xl shadow-sm border border-base-300/50">
              <span class="font-bold text-lg">Sábados</span>
              <span class="badge badge-outline badge-lg font-bold h-auto py-2 text-center">10:00 AM - 3:00 PM</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 opacity-40 p-5">
              <span class="font-bold text-lg">Domingos</span>
              <span class="text-lg font-bold">Cerrado</span>
            </div>
          </div>
        </div>

        <div class="mt-12 p-6 bg-success/10 rounded-2xl border border-success/20 flex gap-4 items-center">
           <ShieldCheck class="w-8 h-8 text-success" />
           <p class="text-sm font-medium">Recepción de equipos garantizada durante todo nuestro horario laboral.</p>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* Optimizaciones de animaciones */
  :global(.reveal-hidden) {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  :global(.animate-enter) {
    opacity: 1;
    transform: translateY(0);
  }

  /* Efecto extra para el hero */
  section video {
    filter: brightness(0.7) contrast(1.1);
  }
</style>
