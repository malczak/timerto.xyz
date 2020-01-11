<script>
  import empty from "../assets/empty.svg";

  // -----------------------
  // Properties
  // -----------------------
  let className;
  export { className as class };
</script>

<div
  class="flex flex-col justify-center items-center content-center {className}">
  <img class="w-1/2 mx-auto" src={empty} alt="Empty state" />
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4
    rounded my-4 capitalize"
    on:click>
    Add first timer
  </button>
</div>
