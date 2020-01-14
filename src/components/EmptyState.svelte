<script>
  import moment from "moment";
  import empty from "app/assets/empty.svg";

  import EventTimer from "app/components/EventTimer";
  import Timoji from "app/components/Timoji.svelte";

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };

  const now = moment();
  let sampleEvent = {
    name: `🎉 End of ${now.year()}`,
    date: now.endOf("year")
  };
</script>

<div
  class="flex flex-col justify-center items-center content-center {className}">
  <h1 class="text-2xl mb-4 text-center">You don't have any events</h1>
  <img class="w-1/2 mx-auto" src={empty} alt="Empty state" />
  <div class="w-full text-center my-8">
    <EventTimer
      class="bg-white rounded shadow-xl"
      editable={false}
      event={sampleEvent} />
  </div>
  <button
    class="flex items-center bg-blue-500 hover:bg-blue-700 text-white text-lg
    font-bold py-2 px-4 rounded my-4 capitalize"
    on:click>
    Add your first timer
    <Timoji class="text-2xl ml-2" />
  </button>
</div>
