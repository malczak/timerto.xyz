<script context="module">
  import { events } from "./stores.js";
  events.load();
</script>

<script>
  import moment from "moment";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import "moment/locale/pl";
  import "./styles/index.less";
  import "./styles/tailwind.css";

  import { time } from "./stores.js";

  import TimeCounter from "app/TimeCounter/index.svelte";
  import TimerEditor from "app/views/TimerEditor.svelte";
  import EmptyState from "app/components/EmptyState.svelte";
  import ChevronDown from "app/components/icons/ChevronDown.svelte";

  moment.locale("pl");

  const NoGroup = "-no-group-";

  // -----------------------
  // Internal
  // -----------------------
  let showCreateEvent = false;
  let groupCollapseState = {};

  $: hasEvents = $events.length !== 0;
  $: groupedEvents = $events.reduce((accum, event) => {
    const group = event.group || NoGroup;
    const groupEvents = accum[group] || [];
    groupEvents.push(event);
    accum[group] = groupEvents;
    return accum;
  }, {});

  function onAddTimer() {
    showCreateEvent = true;
  }

  function toggleGroupCollapse(group) {
    groupCollapseState[group] =
      groupCollapseState[group] === true ? false : true;
  }
</script>

<style>
  /* purgecss start ignore */
  .group .group__chevron {
    transform: none;
    transition: transform 0.4s;
  }

  .group .group__chevron--down {
    transform: rotate(180deg);
  }
  /* purgecss end ignore */
</style>

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
        <!-- extract a component for group -->
        {#each Object.keys(groupedEvents) as group}
          <div
            class="group w-full md:max-w-md md:mx-auto rounded shadow
            border-gray-400 my-4">
            {#if group !== NoGroup}
              <button
                class="bg-gray-200 w-full p-4 flex flex-row items-center
                group__name"
                on:click={() => toggleGroupCollapse(group)}>
                <p class="flex-1">{group}</p>
                <span
                  class="group__chevron {groupCollapseState[group] ? 'group__chevron--down' : ''}">
                  <ChevronDown />
                </span>
              </button>
            {/if}

            {#if !groupCollapseState[group]}
              <div class="pt-2 pb-1" in:fade out:fade>
                {#each groupedEvents[group] as event}
                  <div class="w-full text-center mb-8">
                    <TimeCounter
                      class="bg-gray-200 border border-gray-400 rounded
                      shadow-md"
                      positiveClass="text-gray-900"
                      negativeClass="text-gray-600"
                      title={event.name}
                      date={moment(event.date).local()} />
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-xs text-center p-2">
                <strong>{groupedEvents[group].length}</strong>
                timers hidden
              </p>
            {/if}
          </div>
        {/each}

      </div>
    {/if}

  </div>

  {#if showCreateEvent}
    <TimerEditor
      on:save={evt => {
        if (events.add(evt.detail.event)) {
          showCreateEvent = false;
        }
      }}
      on:cancel={() => (showCreateEvent = false)} />
  {/if}

</div>
