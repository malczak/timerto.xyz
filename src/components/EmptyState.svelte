<script>
  import moment from "moment";
  import emptyImg from "app/assets/empty.svg";

  import EventTimer from "app/components/EventTimer";
  import Timoji from "app/components/Timoji.svelte";
  import Login from "app/components/Login.svelte";
  import Btn from "./Btn.svelte";

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };

  let showLogin = false;

  const now = moment();
  let sampleEvent = {
    name: `🎉 End of ${now.year()}`,
    date: now.endOf("year")
  };
</script>

<div
  class="flex flex-col justify-center items-center content-center {className}
  mb-6">
  <h1 class="text-2xl mb-4 text-center">You don't have any events</h1>
  <figure class="w-1/2 md:w-1/4 mx-auto">
    <img src={emptyImg} alt="Empty state" />
    <figcaption class="text-right text-xs text-gray-500 mb-1">
      <a href="https://undraw.co" target="_blank">undraw.co</a>
    </figcaption>
  </figure>
  <div class="w-full text-center mt-4">
    <EventTimer
      class="bg-white rounded shadow-xl"
      editable={false}
      event={sampleEvent} />
  </div>
  <Btn variant="primary" class="my-4" on:click>
    Add your first timer
    <Timoji class="text-2xl ml-2" />
  </Btn>
  <div>OR</div>
  <Btn
    class="my-4"
    variant="secondary"
    on:click={() => {
      showLogin = true;
    }}>
    sign in
  </Btn>
  <div>to see your timers</div>

  {#if showLogin}
    <Login
      on:close={() => {
        showLogin = false;
      }} />
  {/if}
</div>
