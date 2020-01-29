<script context="module">
  import { events } from "./stores.js";
  events.load();
</script>

<script>
  import moment from "moment";

  import "./styles/index.less";
  import "./styles/tailwind.css";

  import MainView from "./views/MainView";
  import { locale } from "./stores";
</script>

{#await $locale}
  <p>...loading locales</p>
{:then locale}
  <MainView />
{:catch error}
  <p style="color: red">
    <span>Ups... please reload</span>
    <small>{error.message}</small>
  </p>
{/await}
