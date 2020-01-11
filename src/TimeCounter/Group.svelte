<script>
  import { toString } from "../utils/number.js";
  import { styleWithRatio } from "../utils/styles.js";

  export let type;
  export let style = {};
  export let ratio = null;

  const className = `counter__${type}`;
</script>

<div class="counter__group {className}" style={styleWithRatio(style, ratio)}>
  <slot />
</div>
