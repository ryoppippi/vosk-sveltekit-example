<script lang="ts">
  import { fade } from 'svelte/transition';
  import { RingLoader } from 'svelte-loading-spinners';
</script>

<div class="absolute top-0 bottom-0 left-0 right-0 m-auto flex items-center justify-center " transition:fade>
  <RingLoader size="200" color="#2421ca" />
</div>
