<script>
  import cn from "clsx";
  import { onMount, tick } from "svelte";

  import { events } from "app/stores";

  import Dropdown from "app/components/Dropdown.svelte";
  import XCircle from "app/components/icons/XCircle";

  const noGroupOption = { label: "- None -", value: "-none-" };
  const createGroupOption = { label: "- Create New -", value: "-new-" };

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };
  export let title;
  export let value = noGroupOption.value;

  // -----------------------
  // Internal
  // -----------------------
  let newGroupInput = null;
  let isCreatingNewGroup = false;
  let groups = [];

  function onGroupSelected(group) {
    value = "";

    if (group === createGroupOption.value) {
      isCreatingNewGroup = true;
      // NOTE: wait for `refresh`
      tick().then(() => {
        newGroupInput && newGroupInput.focus();
      });
      return;
    }

    isCreatingNewGroup = false;
    if (group === noGroupOption.value) {
      return;
    }

    value = group;
  }

  function mapGroupsToOptions(groups) {
    const result = [noGroupOption];
    for (let group of groups || []) {
      result.push({ label: group, value: group });
    }
    result.push(createGroupOption);
    return result;
  }

  function cancelCreateGroup() {
    isCreatingNewGroup = false;
    value = noGroupOption.value;
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    value = value || noGroupOption.value;
    return events.subscribe(events => {
      const groupsSet = events.reduce(
        (accum, event) => (event.group ? accum.add(event.group) : accum),
        new Set()
      );
      groups = [...groupsSet];
    });
  });
</script>

<div class={cn('grouppicker', className)}>
  <div class="flex flex-row items-center justify-center">
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold
      flex-1"
      for="group-input">
      {title}
    </label>
    {#if !isCreatingNewGroup}
      <Dropdown
        id="group-input"
        class="relative w-7/12"
        options={mapGroupsToOptions(groups)}
        selectedValue={value}
        on:change={evt => onGroupSelected(evt.target.value)} />
    {:else}
      <div class="flex flex-row w-full items-center">
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500 ml-4"
          id="group-input"
          type="text"
          placeholder="Group name"
          bind:this={newGroupInput}
          bind:value />
        <button
          class="ml-2 text-gray-600 hover:text-red-700"
          on:click={() => cancelCreateGroup()}>
          <XCircle />
        </button>
      </div>
    {/if}
  </div>
</div>
