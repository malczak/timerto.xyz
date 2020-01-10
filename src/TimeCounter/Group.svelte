<script>
  import { toString, styleWithRatio } from "./helpers.js";

  export let type;
  export let style = {};
  export let ratio = null;

  const className = `counter__${type}`;
</script>

<div class="counter__group {className}" style={styleWithRatio(style, ratio)}>
  <slot />
</div>
