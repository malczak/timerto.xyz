<script context="module">
  export const NoGroup = "@----@";
</script>

<script>
  import moment from "moment";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import ChevronDown from "app/components/icons/ChevronDown.svelte";
  import TimeCounter from "app/TimeCounter/index.svelte";

  // -----------------------
  // Properties
  // -----------------------
  export let group;
  export let collapsed = false;

  // -----------------------
  // Internal
  // -----------------------

  const dispatcher = createEventDispatcher();

  function toggleGroupCollapse() {
    collapsed = !collapsed;
  }
</script>

<style>
  .group .group__chevron {
    transform: none;
    transition: transform 0.4s;
  }

  .group .group__chevron--down {
    transform: rotate(180deg);
  }

  .eventtimer .eventtimer__actions {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -50px;
    z-index: 10;
    background: transparent;
    padding: 1em 0;
  }

  .eventtimer:hover .eventtimer__actions {
    display: inline;
  }
</style>

{#if group}
  <div
    class="group w-full md:max-w-md md:mx-auto rounded shadow border-gray-400
    my-4">
    {#if group.name !== NoGroup}
      <button
        class="bg-gray-200 w-full p-4 flex flex-row items-center group__name"
        on:click={() => toggleGroupCollapse()}>
        <p class="flex-1">{group.name}</p>
        <span class="group__chevron {collapsed ? 'group__chevron--down' : ''}">
          <ChevronDown />
        </span>
      </button>
    {/if}

    {#if !collapsed}
      <div
        class="pt-2 pb-1"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}>
        {#each group.events as event}
          <div class="eventtimer relative w-full text-center mb-8">
            <TimeCounter
              class="bg-gray-200 border border-gray-400 rounded shadow-md"
              positiveClass="text-gray-900"
              negativeClass="text-gray-600"
              title={event.name}
              date={moment(event.date).local()} />
            <div class="eventtimer__actions">
              <button
                class="bg-white text-xs hover:bg-blue-500 text-blue-700
                hover:text-white py-1 px-2 border border-blue-500
                hover:border-transparent rounded"
                on:click={dispatcher('edit', { event })}>
                edit
              </button>
              <button
                class="bg-white text-xs hover:bg-red-500 text-red-700
                hover:text-white py-1 px-2 border border-red-500
                hover:border-transparent rounded"
                on:click={dispatcher('delete', { event })}>
                delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-xs text-center p-2">
        <strong>{group.events.length}</strong>
        timers hidden
      </p>
    {/if}
  </div>
{/if}
