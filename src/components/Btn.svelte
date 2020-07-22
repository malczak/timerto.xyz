<script>
  import { cn } from "app/utils/clsx";

  import Spinner from "./Spinner.svelte";

  // -----------------------
  // Props
  // -----------------------
  let className;
  export let disabled = false;
  export let busy = false;
  export let variant = null;
  export { className as class };

  const variants = {
    primary:
      "bg-blue-500 border-blue-500 border hover:border-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
    secondary:
      "bg-white border-gray-700 border hover:border-gray-400 hover:bg-gray-100 hover:text-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
    default:
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
  };
</script>

<button
  type="button"
  class={cn(variants[variant || 'default'], 'capitalize', className, {
    'opacity-50 cursor-not-allowed': disabled
  })}
  aria-disabled={disabled}
  {disabled}
  on:click>
  {#if busy}
    <Spinner color="#ffffff" />
  {:else}
    <slot />
  {/if}
</button>
