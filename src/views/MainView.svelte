<script>
  import moment from "moment";

  import { onMount } from "svelte";

  import { events, time, locale } from "../stores.js";

  import { isDev } from "app/utils/env";
  import { sortOnCompareFnc } from "app/utils/array";
  import SvelteLogo from "app/components/icons/SvelteLogo.svelte";
  import AppIcon from "app/components/icons/AppIcon.svelte";
  import Github from "app/components/icons/Github.svelte";
  import TimerEditor from "app/views/TimerEditor.svelte";
  import ShareLink from "app/components/ShareLink";
  import EmptyState from "app/components/EmptyState.svelte";
  import EventsGroup, { NoGroup } from "app/components/EventsGroup";

  // -----------------------
  // Internal
  // -----------------------

  let showEventForm = false;
  let eventToEdit = null;
  let groupCollapseState = {};
  let groupedEvents = [];
  let sharedEvents = { events: [] };
  let eventShareLink = null;

  $: showEventForm = eventToEdit != null;
  $: hasEvents = $events.length !== 0;
  $: {
    const groupsMap = $events.reduce((map, event) => {
      if (event.shared === true) {
        sharedEvents.events.push(event);
        return map;
      }

      const groupName = event.group || NoGroup;
      let data = map.get(groupName);
      if (!data) {
        data = { name: groupName, events: [event] };
      } else {
        data.events.push(event);
      }
      return map.set(groupName, data);
    }, new Map());
    console.log(sharedEvents);
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

  function createShareLink(event) {
    const data = [
      event.name,
      moment.utc(event.date).unix(),
      event.autoremove === true ? 1 : 0
    ];

    const blob = new window.Blob([JSON.stringify(data)], {
      type: "application/json"
    });

    var reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      let base64data = reader.result.replace(/^data:.+;base64,/, "");
      eventShareLink = `${document.location.origin}?e=${base64data}`;
    };
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

        {#if sharedEvents.events.length}
          <EventsGroup
            group={sharedEvents}
            editable={false}
            collapsable={false} />
        {/if}

        {#each groupedEvents as group}
          <EventsGroup
            {group}
            on:edit={e => (eventToEdit = e.detail.event)}
            on:delete={e => events.remove(e.detail.event)}
            on:share={e => createShareLink(e.detail.event)} />
        {/each}
      </div>
    {/if}

    {#if eventShareLink}
      <ShareLink
        link={eventShareLink}
        on:close={() => (eventShareLink = null)} />
    {/if}

  </div>

</div>

<div
  class="footer bg-gray-100 flex-shrink-0 flex flex-col items-center text-xs
  py-4">
  <div class="flex flex-row justify-center">
    Made with
    <div class="logo svelte mx-1">
      <a href="https://svelte.dev" title="Svelte" target="_blank">
        <SvelteLogo />
      </a>
    </div>
    and available on
    <div class="logo github mx-1">
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
  <small class="block">
    Date locale
    <b>{$locale.detected || 'en_US'}</b>
  </small>
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
