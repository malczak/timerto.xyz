<script>
  import moment from "moment";
  import { onMount } from "svelte";

  import "moment/locale/pl";
  import "./styles/index.less";
  import "./styles/tailwind.css";

  import { time } from "./stores.js";

  import TimeCounter from "./TimeCounter/index.svelte";
  import TimerEditor from "./views/TimerEditor.svelte";

  moment.locale("pl");

  // -----------------------
  // Internal
  // -----------------------
  let showCreateEvent = false;

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    setTimeout(() => (showCreateEvent = true), 1000);
  });
</script>

<div class="w-full">
  <div class="max-w-3xl mx-auto py-4">
    <h1 class="mb-4">Timerto.xyz</h1>
    <div class="w-full text-center mb-2">
      <TimeCounter
        class="bg-gray-400"
        title="Super"
        date={moment().add(2, 'years')} />
    </div>
    <div class="w-full text-center mb-2">
      <TimeCounter class="bg-gray-400" date={moment().add(2, 'months')} />
    </div>
    <div class="w-full text-center mb-2">
      <TimeCounter class="bg-gray-400" date={moment().add(2, 'days')} />
    </div>
    <div class="w-full text-center mb-2">
      <TimeCounter class="bg-gray-400" date={moment().add(2, 'hours')} />
    </div>
    <div class="w-full text-center mb-2">
      <TimeCounter class="bg-gray-400" date={moment().add(2, 'minutes')} />
    </div>
    <div class="w-full text-center mb-2">
      <TimeCounter class="bg-gray-400" date={moment().add(10, 'seconds')} />
    </div>
  </div>

  {#if showCreateEvent}
    <TimerEditor
      on:save={evt => {
        console.log('EVENT:', evt.detail.event);
        showCreateEvent = false;
      }}
      on:cancel={() => (showCreateEvent = false)} />
  {/if}

</div>
