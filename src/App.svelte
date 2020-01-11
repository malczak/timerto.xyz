<script>
  import moment from "moment";
  import { onMount } from "svelte";

  import "moment/locale/pl";
  import "./styles/index.less";
  import "./styles/tailwind.css";

  import { time } from "./stores.js";

  import TimeCounter from "./TimeCounter/index.svelte";
  import TimerEditor from "./views/TimerEditor.svelte";
  import EmptyState from "./components/EmptyState.svelte";

  moment.locale("pl");

  // -----------------------
  // Internal
  // -----------------------
  let showCreateEvent = false;
  let events = [];

  $: hasEvents = events && events.length !== 0;

  function onAddTimer() {
    showCreateEvent = true;
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    events = window.localStorage.getItem("events") || [];

    setTimeout(() => {
      events = [
        { name: "So far in future", date: moment().add(2, "years") },
        { name: "Just seconds", date: moment().add(2, "months") },
        { name: "Days", date: moment().add(2, "days") },
        { name: "Hours away", date: moment().add(2, "hours") },
        { name: "Minutes away", date: moment().add(2, "minutes") },
        { name: "Just seconds", date: moment().add(10, "seconds") }
      ];
    }, 1500);
  });
</script>

<div class="w-full h-full">

  <div class="max-w-3xl mx-auto h-full pb-4 flex flex-col">

    <ul class="flex py-4">
      <li class="mr-3">
        <span class="inline-block py-1 px-3 text-gray-400 cursor-not-allowed">
          Timer to XYZ
        </span>
      </li>
      <li class="flex-1" />
      {#if hasEvents}
        <li class="mr-3">
          <button
            class="inline-block border border-blue-500 rounded py-1 px-3
            bg-blue-500 text-white"
            on:click={onAddTimer}>
            Add timer
          </button>
        </li>
      {/if}
    </ul>

    {#if !hasEvents}
      <EmptyState class="w-full flex-1" on:click={onAddTimer} />
    {:else}
      <div class="flex-1">
        {#each events as event}
          <div class="w-full text-center my-8">
            <TimeCounter
              class="bg-gray-400"
              title={event.name}
              date={moment(event.date)} />
          </div>
        {/each}
      </div>
    {/if}

  </div>

  {#if showCreateEvent}
    <TimerEditor
      on:save={evt => {
        events = [evt.detail.event, ...events];
        showCreateEvent = false;
      }}
      on:cancel={() => (showCreateEvent = false)} />
  {/if}

</div>
