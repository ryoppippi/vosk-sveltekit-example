<script lang="ts">
  import { createModel } from 'vosk-browser';
  import { browser } from '$app/env';
  import ModelsList from '$components/ModelsList.svelte';
  import Loading from '$components/Loading.svelte';

  const sampleRate = 48000;

  let textList: string[] = [];
  let textListIndex = 0;
  let selectedModelPath: string;
  let recognizer: any = null;
  let processor: null | ScriptProcessorNode = null;

  if (browser) {
    window.AudioContext = window.AudioContext || window.webkitAuduioContext;
  }

  const createRecognizer = async (sampleRate: number) => {
    const model = await createModel(selectedModelPath);
    const recognizer = new model.KaldiRecognizer(sampleRate);
    recognizer.setWords(true);
    recognizer.on('result', (message) => {
      if (message.event == 'result') {
        const { text } = message.result;
        console.log(`Result: ${text}`);
        textList[textListIndex] = text;
        textListIndex += 1;
      }
    });
    recognizer.on('partialresult', (message) => {
      if (message.event == 'partialresult') {
        const { partial } = message.result;
        console.log(`Partial result: ${partial}`);
        if (textList[textListIndex] == undefined) {
          textList.push(partial);
        } else {
          textList[textListIndex] = partial;
        }
      }
    });
    return recognizer;
  };

  const streamHandler = (stream: MediaStream) => {
    const context = new AudioContext({ sampleRate });
    const source = context.createBufferSource();
    const input = context.createMediaStreamSource(stream);
    recognizer = createRecognizer(context.sampleRate);
    processor = context.createScriptProcessor(4096, 1, 1);
    input.connect(processor);
    processor.onaudioprocess = (e) => {
      const inputBuffer = e.inputBuffer;
      recognizer.then((r) => r.acceptWaveform(inputBuffer));
    };
    processor.connect(context.destination);
  };

  const stop = () => {
    if (processor) {
      processor.disconnect();
      processor.onaudioprocess = null;
      processor = null;
      recognizer = null;
    }
  };

  const start = () => {
    textList = [];
    recognizer = 0;
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          channelCount: 1,
          sampleRate,
        },
      })
      .then(streamHandler)
      .catch((e) => console.error(e));
  };
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">VOSK-Browser Demo</h1>
      {#await recognizer}
        <Loading />
      {:then}
        <div class="input-group flex justify-center py-5">
          <ModelsList bind:selectedModelPath />
          <button
            on:click={() => {
              recognizer ? stop() : start();
            }}
            class="btn"
            class:btn-primary={!recognizer}
            class:btn-secondary={recognizer}
            class:btn-disabled={recognizer === 0}
          >
            {recognizer ? 'Stop' : 'Start'}
          </button>
        </div>
      {/await}
    </div>
    <div class="flex flex-col">
      {#each textList as tr, i}
        {#if tr}
          <div class="card my-3 w-96 bg-primary text-primary-content">
            <div class="card-body">
              <p class="py-3">{tr}</p>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>
