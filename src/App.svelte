<script context="module">
  import { events } from "./stores.js";
  events.load();
</script>

<script>
  import moment from "moment";

  import "./styles/index.less";
  import "./styles/tailwind.css";

  import MainView from "./views/MainView";
  import AppIcon from "app/components/icons/AppIcon.svelte";
  import { locale } from "./stores";
</script>

{#await $locale}
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="w-6 h-6">
      <AppIcon />
    </div>
    <div>...loading locales</div>
  </div>
{:then locale}
  <MainView />
{:catch error}
  <p style="color: red">
    <span>Ups... please reload</span>
    <small>{error.message}</small>
  </p>
{/await}
