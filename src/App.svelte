<script context="module">
  import { events } from "./stores.js";
  events.load();
</script>

<script>
  import moment from "moment";
  import { onMount } from "svelte";

  import "./styles/index.less";
  import "./styles/tailwind.css";

  import { time } from "./stores.js";

  import { isDev } from "app/utils/env";
  import { sortOnCompareFnc } from "app/utils/array";
  import SvelteLogo from "app/components/icons/SvelteLogo.svelte";
  import AppIcon from "app/components/icons/AppIcon.svelte";
  import Github from "app/components/icons/Github.svelte";
  import TimerEditor from "app/views/TimerEditor.svelte";
  import EmptyState from "app/components/EmptyState.svelte";
  import EventsGroup, { NoGroup } from "app/components/EventsGroup";

  //   import "moment/locale/pl";
  //   moment.locale("pl");

  // -----------------------
  // Internal
  // -----------------------

  let showEventForm = false;
  let eventToEdit = null;
  let groupCollapseState = {};
  let groupedEvents = [];

  $: showEventForm = eventToEdit != null;
  $: hasEvents = $events.length !== 0;
  $: {
    const groupsMap = $events.reduce((map, event) => {
      const groupName = event.group || NoGroup;
      let data = map.get(groupName);
      if (!data) {
        data = { name: groupName, events: [event] };
      } else {
        data.events.push(event);
      }
      return map.set(groupName, data);
    }, new Map());

    const nameCompareFnc = sortOnCompareFnc("name");
    const dateCompareFnc = sortOnCompareFnc("date");
    groupedEvents = [...groupsMap.values()].sort(nameCompareFnc).map(group => {
      group.events.sort(dateCompareFnc);
      return group;
    });
  }

  function onAddTimer() {
    showEventForm = true;
  }
</script>

<style>
  .app {
    width: 100%;
    /* min-height: 100%; */
  }

  .footer .author {
    border-bottom-width: 1px;
    border-bottom-style: dotted;
    margin-bottom: -1px;
  }

  .logo {
    display: inline-block;
    width: 16px;
    height: auto;
  }

  .logo.x2 {
    width: 32px;
  }

  .logo.svelte {
    color: #ff3e00;
  }

  .logo.github {
    color: #181717;
  }
</style>

<div class="app flex-1 bg-gray-100 px-3">

  <div class="max-w-3xl mx-auto flex flex-col">

    <ul class="flex py-4">
      <li class="logo x2">
        <AppIcon />
      </li>
      <li>
        <span class="inline-block py-1 px-3 text-blue-500">Timer to XYZ</span>
      </li>
      <li class="flex-1" />
      {#if hasEvents}
        <li>
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
            date: moment().add(10, 'seconds'),
            autoremove: true
          });
        }}>
        Add expiring timer
      </button>
    {/if}

    {#if !hasEvents}
      <EmptyState class="flex-1 w-full" on:click={onAddTimer} />
    {:else}
      <div class="flex-1">
        {#each groupedEvents as group}
          <EventsGroup
            {group}
            on:edit={e => (eventToEdit = e.detail.event)}
            on:delete={e => events.remove(e.detail.event)} />
        {/each}
      </div>
    {/if}

  </div>

</div>

<div
  class="footer bg-gray-100 flex-shrink-0 flex flex-row items-center
  justify-center text-xs py-4">
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
