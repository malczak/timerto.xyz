<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { lock } from "app/utils/document";
  import Modal from "./Modal.svelte";

  export let link = "";
  let input;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const locker = lock();
    input.focus();
    input.select();
    return locker();
  });
</script>

<Modal>
  <slot>
    <div class="w-full max-w-lg">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username">
            Event link
          </label>
          <input
            bind:this={input}
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700
            leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Link"
            value={link} />
        </div>
        <div class="flex flex-row-reverse">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
            rounded focus:outline-none focus:shadow-outline"
            type="button"
            on:click={() => dispatch('close')}>
            Close
          </button>
        </div>
      </form>
      <p class="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  </slot>
</Modal>
