<script>
  import { onMount } from "svelte";
  import { toStylesStr } from "../utils/styles.js";
  import { scrollToTopAndLock } from "../utils/document";
  import TimerForm from "../components/TimerForm.svelte";

  // -----------------------
  // Properties
  // -----------------------
  export let event = null;

  // -----------------------
  // Lifecycle
  // -----------------------

  onMount(() => {
    return scrollToTopAndLock();
  });
</script>

<div
  class="flex items-center justify-center absolute inset-0 z-40"
  style={toStylesStr({ 'background-color': 'rgba(113, 128, 150, 0.9)' })}>
  <TimerForm
    class="bg-white m-4 py-2 w-full md:max-w-sm rounded overflow-hidden
    shadow-lg inline-block"
    label={event ? 'Update event' : 'Add event'}
    {event}
    on:save
    on:cancel />
</div>
