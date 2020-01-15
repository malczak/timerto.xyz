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

  import { isDev } from "app/utils/env";
  import SvelteLogo from "app/components/icons/SvelteLogo.svelte";
  import Github from "app/components/icons/Github.svelte";
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

<style>
  .footer .author {
    border-bottom-width: 1px;
    border-bottom-style: dotted;
    margin-bottom: -1px;
  }

  .footer .logo {
    display: inline-block;
    width: 16px;
    height: auto;
  }

  .footer .logo.svelte {
    color: #ff3e00;
  }

  .footer .logo.github {
    color: #181717;
  }
</style>

<div class="w-full h-full">

  <div class="max-w-3xl mx-auto h-full pb-4 flex flex-col">

    <ul class="flex py-4">
      <li class="mr-3">
        <span class="inline-block py-1 px-3 text-gray-400">Timer to XYZ</span>
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

    {#if isDev}
      <button
        class="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500
        text-white"
        on:click={() => {
          events.add({
            name: 'Random autoremovable',
            date: moment().add(5, 'seconds'),
            autoremove: true
          });
        }}>
        Add expiring timer
      </button>
    {/if}

    {#if !hasEvents}
      <EmptyState class="w-full" on:click={onAddTimer} />
    {:else}
      <div class="flex-1">
        {#each Object.keys(groupedEvents) as group}
          <EventsGroup
            group={groupedEvents[group]}
            on:edit={e => (eventToEdit = e.detail.event)}
            on:delete={e => events.remove(e.detail.event)} />
        {/each}
      </div>
      <div
        class="footer flex flex-row items-center justify-center text-xs mt-4
        pb-4">
        Made with
        <div class="logo svelte mx-2">
          <a href="https://svelte.dev" title="Svelte" target="_blank">
            <SvelteLogo />
          </a>
        </div>
        and available on
        <div class="logo github mx-2">
          <a href="https://github.com/malczak/timerto.xyz" target="_blank">
            <Github />
          </a>
        </div>
        by
        <a
          class="author ml-1 text-blue-500 border-blue-500"
          href="https://malczak.info"
          target="_blank">
          Matt
        </a>
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
