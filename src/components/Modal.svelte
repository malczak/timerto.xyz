<script>
  import { onMount } from "svelte";
  import { toStylesStr } from "../utils/styles.js";
  import { scrollToTopAndLock } from "../utils/document";

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
  <slot />
</div>
