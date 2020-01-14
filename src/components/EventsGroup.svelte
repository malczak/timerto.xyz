<script context="module">
  export const NoGroup = "@----@";
</script>

<script>
  import moment from "moment";
  import { fade } from "svelte/transition";
  import ChevronDown from "app/components/icons/ChevronDown.svelte";
  import EventTimer from "app/components/EventTimer";

  // -----------------------
  // Properties
  // -----------------------
  export let group;
  export let collapsed = false;

  // -----------------------
  // Internal
  // -----------------------

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
          <EventTimer {event} on:edit on:delete />
        {/each}
      </div>
    {:else}
      <p
        class="text-xs text-center p-2"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}>
        <strong>{group.events.length}</strong>
        timers hidden
      </p>
    {/if}
  </div>
{/if}
