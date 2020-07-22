<script>
  import { createEventDispatcher } from "svelte";

  import AppIcon from "app/components/icons/AppIcon.svelte";
  import Btn from "./Btn.svelte";

  // -----------------------
  // Internal
  // -----------------------
  const dispatcher = createEventDispatcher();
</script>

<style>
  .logo {
    display: inline-block;
    width: 32px;
    height: auto;
    margin-top: -6px;
  }
</style>

<div class="flex flex-wrap items-center py-4">
  <ul class="flex items-center md:w-1/2 md:justify-start w-full justify-center">
    <li class="logo">
      <AppIcon />
    </li>
    <li>
      <span class="handdrawn text-2xl inline-block px-3 text-blue-500">
        Timer to XYZ
      </span>
    </li>
  </ul>
  <ul class="flex items-center md:w-1/2 md:justify-end w-full justify-center">
    <li>
      <Btn variant="primary" on:click={() => dispatcher('create')}>
        Add timer
      </Btn>
    </li>
    <li>
      <Btn
        class="ml-2"
        variant="secondary"
        on:click={() => dispatcher('login')}>
        Sign In
      </Btn>
    </li>
  </ul>
</div>
