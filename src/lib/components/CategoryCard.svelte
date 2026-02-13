<script lang="ts">
  import type { Component } from "svelte";

  interface Props {
    image: string;
    title: string;
    description: string;
  }

  let { image, title, description }: Props = $props();
</script>

<div
  class="card card-compact border-2 border-transparent bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
>
  <figure
    class="relative w-full aspect-square bg-white overflow-hidden rounded-t-xl flex items-center justify-center p-4"
  >
    <img
      src={image}
      alt={title}
      class="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
    />
  </figure>
  <div class="card-body">
    <h3 class="card-title">
      {title}
    </h3>
    <p>{description}</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary btn-sm">Ver más</button>
    </div>
  </div>
</div>
