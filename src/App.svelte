<script context="module">
  import { events } from "./stores.js";
  events.load();
</script>

<script>
  import moment from "moment";
  import { onMount } from "svelte";

  import "moment/locale/pl";
  import "./styles/index.less";
  import "./styles/tailwind.css";

  import { time } from "./stores.js";

  import TimerEditor from "app/views/TimerEditor.svelte";
  import EmptyState from "app/components/EmptyState.svelte";
  import EventsGroup, { NoGroup } from "app/components/EventsGroup";

  moment.locale("pl");

  // -----------------------
  // Internal
  // -----------------------

  let showEventForm = false;
  let eventToEdit = null;
  let groupCollapseState = {};

  $: showEventForm = eventToEdit != null;
  $: hasEvents = $events.length !== 0;
  $: groupedEvents = $events.reduce((accum, event) => {
    const group = event.group || NoGroup;
    const groupEvents = accum[group] || { name: group, events: [] };
    groupEvents.events.push(event);
    accum[group] = groupEvents;
    return accum;
  }, {});

  function onAddTimer() {
    showEventForm = true;
  }
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
        {#each Object.keys(groupedEvents) as group}
          <EventsGroup
            group={groupedEvents[group]}
            on:edit={e => (eventToEdit = e.detail.event)}
            on:delete={e => events.remove(e.detail.event)} />
        {/each}

      </div>
    {/if}

  </div>

  {#if showEventForm}
    <TimerEditor
      event={eventToEdit}
      on:save={evt => {
        let result = false;
        if (eventToEdit) {
          result = events.replace(eventToEdit, evt.detail.event);
        } else {
          result = events.add(evt.detail.event);
        }
        eventToEdit = null;
        if (result) {
          showEventForm = false;
        }
      }}
      on:cancel={() => {
        eventToEdit = null;
        showEventForm = false;
      }} />
  {/if}

</div>
