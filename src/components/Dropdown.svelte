<script>
  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };
  export let id;
  export let options;
  export let selectedValue;

  // -----------------------
  // Internal
  // -----------------------
  function hasValidOptions(options) {
    return options && options.length > 1;
  }
</script>

<div {id} class="dropdown relative {className}">
  <select
    class="block text-s appearance-none w-full bg-gray-200 border
    border-gray-200 disabled:opacity-75 text-gray-700 py-3 px-3 rounded
    leading-tight focus:outline-none focus:bg-white disabled:text-center
    focus:border-gray-500"
    value={selectedValue}
    disabled={!hasValidOptions(options)}
    on:change>
    {#each options as option}
      <option key={option.value} value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if hasValidOptions(options)}
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center
      px-2 text-gray-700">
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586
          4.343 8z" />
      </svg>
    </div>
  {/if}
</div>
