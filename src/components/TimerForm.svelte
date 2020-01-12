<script>
  import cn from "clsx";
  import moment from "moment";
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import GroupPicker from "./GroupPicker.svelte";

  // NOTE: all dates are in UTC

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export let label;
  export let showCancel = true;
  export { className as class };

  // -----------------------
  // Internal
  // -----------------------
  const dispatch = createEventDispatcher();

  let name;
  let group = "";
  let date = moment().utc();

  $: isValid = name != null && name.length > 1 && date && date.isValid();

  // -----------------------
  // Handlers
  // -----------------------

  function onSave() {
    if (isValid) {
      dispatch("save", { event: { name, date, group } });
    }
  }
</script>

<div class={cn('profileform', 'flex flex-col', className)}>
  <div class="w-full px-3 mb-4">
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
    class="w-full px-3 mb-4"
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
    value={moment.utc()}
    on:change={evt => (date = moment.utc(evt.detail.date))} />

  <GroupPicker class="w-full px-3 mb-4" title="Group" bind:value={group} />

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