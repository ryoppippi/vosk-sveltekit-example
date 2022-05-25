<script lang="ts">
  export let selectedModelPath: string;

  import { base } from '$app/paths';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import { writable } from 'svelte-local-storage-store';

  let selectedValue: string;
  const selectedValueInLS = writable('selectedValueInLS', '');

  const modelsList: Array<{ name: string; path: string }> = [
    {
      name: 'Catalan',
      path: 'vosk-model-small-ca-0.4.tar.gz',
    },
    {
      name: 'Chinese',
      path: 'vosk-model-small-cn-0.3.tar.gz',
    },
    {
      name: 'Deutsch',
      path: 'vosk-model-small-de-0.15.tar.gz',
    },
    {
      name: 'Indian English',
      path: 'vosk-model-small-en-in-0.4.tar.gz',
    },
    {
      name: 'English',
      path: 'vosk-model-small-en-us-0.15.tar.gz',
    },
    {
      name: 'Español',
      path: 'vosk-model-small-es-0.3.tar.gz',
    },
    {
      name: 'Farsi',
      path: 'vosk-model-small-fa-0.4.tar.gz',
    },
    {
      name: 'French',
      path: 'vosk-model-small-fr-pguyot-0.3.tar.gz',
    },
    {
      name: 'Italiano',
      path: 'vosk-model-small-it-0.4.tar.gz',
    },
    {
      name: 'Japanese',
      path: 'vosk-model-small-ja-0.22.tar.gz',
    },
    {
      name: 'Malayalam',
      path: 'vosk-model-malayalam-bigram.tar.gz',
    },
    {
      name: 'Portuguese',
      path: 'vosk-model-small-pt-0.3.tar.gz',
    },
    {
      name: 'Russian',
      path: 'vosk-model-small-ru-0.4.tar.gz',
    },
    {
      name: 'Turkish',
      path: 'vosk-model-small-tr-0.3.tar.gz',
    },
    {
      name: 'Vietnamese',
      path: 'vosk-model-small-vn-0.3.tar.gz',
    },
  ];

  const getModelPath = (name: string) => `${base}/models/${name}`;

  $: {
    if (selectedValue) {
      selectedModelPath = getModelPath(selectedValue);
      if (browser) selectedValueInLS.set(selectedValue);
      console.log($selectedValueInLS);
    }
  }

  onMount(() => {
    if (browser && $selectedValueInLS) selectedValue = $selectedValueInLS;
    console.log($selectedValueInLS);
  });
</script>

<select class="select select-bordered" bind:value={selectedValue}>
  {#each modelsList as m}
    <option value={m.path}>{m.name}</option>
  {/each}
</select>
