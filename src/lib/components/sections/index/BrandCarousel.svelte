<script lang="ts">
let brandNames = [
	{ name: "KLM", height: "h-12" },
	{ name: "DIOR", height: "h-8" },
	{ name: "campina", height: "h-22" },
	{ name: "eneco", height: "h-8" },
	{ name: "tommyhilfiger", height: "h-4" },
	{ name: "novartis", height: "h-18" },
	{ name: "exact", height: "h-8" },
	{ name: "gemeenteamsterdam", height: "h-16" },
	{ name: "jagermeister", height: "h-22" },
	{ name: "museumvereniging", height: "h-14" },
	{ name: "deloitte", height: "h-8" },
	{ name: "porsche", height: "h-6" },
	{ name: "unilever", height: "h-22" },
	{ name: "walmart", height: "h-12" },
];
</script>

<div class="relative overflow-hidden py-8 lg:py-12 2xl:py-16 bg-black">
  <div class="flex animate-scroll items-center">
    {#each [...brandNames, ...brandNames] as { name, height }}
      <img src={`/svg/brands/${name}_logo.svg`} alt="{name} logo" class={`w-auto object-contain dark:invert opacity-30 hover:opacity-70 duration-800 flex-shrink-0 mr-12 ${height}`} />
    {/each}
  </div>
  <!-- Left gradient fade -->
  <div class="absolute left-0 top-0 h-full w-100 bg-gradient-to-r from-white to-transparent dark:from-black pointer-events-none"></div>
  <!-- Right gradient fade -->
  <div class="absolute right-0 top-0 h-full w-100 bg-gradient-to-l from-white to-transparent dark:from-black pointer-events-none"></div>
</div>

<style>
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-scroll {
    animation: scroll 30s linear infinite;
    display: flex;
    width: max-content;
  }
</style>
