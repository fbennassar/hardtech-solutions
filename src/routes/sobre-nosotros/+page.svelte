<script lang="ts">
  import { Users, Target, Shield, Award } from "lucide-svelte";
  import { themeState } from "$lib/theme.svelte";
  
  function reveal(node: Element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add("animate-enter");
          observer.unobserve(node);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(node);
    return { destroy() { observer.disconnect(); } };
  }
</script>

<svelte:head>
  <title>Sobre Nosotros | HardTech Solutions</title>
  <meta name="description" content="Conoce la historia, misión y visión de HardTech Solutions, los expertos en tecnología y reparaciones." />
</svelte:head>

<div class="flex flex-col gap-16 md:gap-24 mb-20 animate-fade-in-up">
  <!-- Hero Section -->
  <div class="bg-base-200 py-16 md:py-24">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-6">
        Sobre <span class="text-primary">Nosotros</span>
      </h1>
      <p class="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto">
        Somos pioneros en llevar la reparación de equipos y la venta de componentes al siguiente nivel. Nuestra pasión es la tecnología y la excelencia al servicio de los gamers y profesionales.
      </p>
    </div>
  </div>

  <!-- Historia / Valores -->
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div use:reveal class="reveal-hidden">
        <h2 class="text-3xl font-bold mb-6">Nuestra Historia</h2>
        <p class="text-lg text-base-content/80 mb-4">
          HardTech Solutions nació con una meta clara: ser el refugio seguro para todo entusiasta del PC, hardware y gaming. Empezamos en un pequeño taller y nos guiamos por un solo principio: la transparencia.
        </p>
        <p class="text-lg text-base-content/80 mb-6">
          Hoy, proveemos soluciones tanto a entusiastas que arman su primera PC como a empresas que dependen del máximo rendimiento de su infraestructura IT, siempre de la mano de expertos dedicados.
        </p>
        <div class="flex gap-4 mt-8">
          <div class="bg-primary/10 p-4 w-32 rounded-xl text-primary flex flex-col items-center justify-center font-bold text-center">
            <span class="text-4xl block mb-1">10+</span>
            <span class="text-xs uppercase tracking-wide">Años Exp.</span>
          </div>
          <div class="bg-secondary/10 p-4 w-32 rounded-xl text-secondary flex flex-col items-center justify-center font-bold text-center">
            <span class="text-4xl block mb-1">5K+</span>
            <span class="text-xs uppercase tracking-wide">Reparados</span>
          </div>
        </div>
      </div>
      <div use:reveal class="reveal-hidden relative">
        <div class="aspect-square md:aspect-video bg-base-300 rounded-3xl overflow-hidden shadow-2xl relative border border-base-200 flex items-center justify-center p-8">
           <img 
            src={themeState.current === "daisymax" ? "/modo_oscuro_logo.svg" : "/modo_claro_logo.svg"} 
            alt="Gamer Fix Logo" 
            class="h-48 md:h-64 object-contain transition-all duration-300" 
           />
        </div>
      </div>
    </div>
  </div>

  <!-- Core Values -->
  <div class="bg-base-200 py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">Nuestros Pilares</h2>
        <p class="text-lg text-base-content/70 mt-4 max-w-2xl mx-auto">Lo que nos define en cada servicio y cada venta.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div use:reveal class="reveal-hidden card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors">
          <div class="card-body items-center text-center">
            <Shield class="w-12 h-12 text-primary mb-4" />
            <h3 class="card-title text-xl">Transparencia</h3>
            <p class="text-sm text-base-content/70">Siempre sabrás qué le pasa a tu equipo y cuánto costará. Sin sorpresas.</p>
          </div>
        </div>
        <div use:reveal class="reveal-hidden card bg-base-100 shadow-xl border border-base-200 hover:border-secondary transition-colors" style="transition-delay: 100ms">
          <div class="card-body items-center text-center">
            <Target class="w-12 h-12 text-secondary mb-4" />
            <h3 class="card-title text-xl">Excelencia</h3>
            <p class="text-sm text-base-content/70">Usamos repuestos originales y los mejores componentes del mercado.</p>
          </div>
        </div>
        <div use:reveal class="reveal-hidden card bg-base-100 shadow-xl border border-base-200 hover:border-success transition-colors" style="transition-delay: 200ms">
          <div class="card-body items-center text-center">
            <Users class="w-12 h-12 text-success mb-4" />
            <h3 class="card-title text-xl">Comunidad</h3>
            <p class="text-sm text-base-content/70">No solo arreglamos equipos, guiamos a los usuarios para que aprendan.</p>
          </div>
        </div>
        <div use:reveal class="reveal-hidden card bg-base-100 shadow-xl border border-base-200 hover:border-info transition-colors" style="transition-delay: 300ms">
          <div class="card-body items-center text-center">
            <Award class="w-12 h-12 text-info mb-4" />
            <h3 class="card-title text-xl">Garantía</h3>
            <p class="text-sm text-base-content/70">Respaldo total en el trabajo técnico para tu total tranquilidad.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
