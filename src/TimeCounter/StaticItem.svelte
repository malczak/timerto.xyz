<script>
  import { styleWithRatio } from "../utils/styles.js";
  export let value = null;
  export let label = null;
  export let style = {};
  export let ratio = null;
</script>

<svelte:options immutable={true} />
<div class="counter__item" style={styleWithRatio(style, ratio)}>
  <span class="counter__value">
    {#if value != null}{value}{/if}
  </span>
  {#if label}
    <span class="counter__label">{label}</span>
  {/if}
</div>
