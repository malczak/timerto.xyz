<script>
  import cn from "clsx";
  import moment from "moment";
  import { onMount, createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import GroupPicker from "./GroupPicker.svelte";
  import Switch from "./Switch.svelte";

  // NOTE: all dates are in UTC

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export let label;
  export let showCancel = true;
  export let event = null;
  export let autoremove = false;
  export { className as class };

  // -----------------------
  // Internal
  // -----------------------
  const dispatch = createEventDispatcher();

  let name;
  let group = "";
  let date = moment();

  $: isValid = name != null && name.length > 1 && date && date.isValid();
  $: inFuture = date && date.isAfter(moment().endOf("day"));

  function updateDate(newDate) {
    const $date = moment(newDate);
    date = $date;
  }

  // -----------------------
  // Handlers
  // -----------------------

  function onSave() {
    if (isValid) {
      dispatch("save", { event: { name, date, group } });
    }
  }

  // -----------------------
  // Lifecycle
  // -----------------------
  onMount(() => {
    if (event) {
      name = event.name;
      group = event.group;
      date = moment(event.date);
    }
  });
</script>

<div class={cn('profileform', 'flex flex-col px-3', className)}>
  <div class="w-full mb-4">
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      htmlFor="input-event-name">
      Name
    </label>
    <input
      class="appearance-none block w-full bg-gray-200 text-gray-700 border
      border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
      focus:bg-white focus:border-gray-500"
      id="input-event-name"
      type="text"
      placeholder="Event name"
      bind:value={name} />
  </div>

  <DatePicker
    class="w-full mb-4"
    title="Birthdate"
    minDate={moment
      .utc()
      .subtract(80, 'year')
      .startOf('year')
      .toDate()}
    maxDate={moment
      .utc()
      .add(80, 'year')
      .startOf('year')
      .toDate()}
    value={date}
    on:change={evt => updateDate(evt.detail.date)} />

  <GroupPicker class="w-full mb-4" title="Group" bind:value={group} />

  {#if inFuture}
    <div class="flex flex-row items-center justify-center mb-4">
      <label
        class="block flex-1 uppercase tracking-wide text-gray-700 text-xs
        font-bold mb-2">
        Autoremove
      </label>
      <Switch bind:checked={autoremove} />
    </div>
  {/if}

  <div class="relative inline-block text-center">
    <button
      class={cn('text-white font-bold py-2 px-4 rounded', {
        'bg-blue-500 hover:bg-blue-700': isValid,
        'bg-blue-300 hover:bg-blue-300': !isValid
      })}
      on:click={onSave}>
      {label}
    </button>
    {#if showCancel}
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4
        rounded"
        on:click={() => dispatch('cancel')}>
        Cancel
      </button>
    {/if}
  </div>
</div>
