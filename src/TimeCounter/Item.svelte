<script>
  import { toString, styleWithRatio } from "./helpers.js";

  export let value = null;
  export let label = null;
  export let style = {};
  export let ratio = null;
</script>

<div class="relative counter__item" style={styleWithRatio(style, ratio)}>
  <span class="counter__value">
    {#if value != null}{toString($value)}{/if}
  </span>
  {#if label}
    <span class="counter__label">{label}</span>
  {/if}
</div>
