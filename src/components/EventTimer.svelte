<script>
  import moment from "moment";
  import { createEventDispatcher } from "svelte";

  import ArrowLeft from "app/components/icons/ArrowLeft.svelte";
  import TimeCounter from "app/TimeCounter";
  import device from "app/utils/device";

  // -----------------------
  // Properties
  // -----------------------
  export let event;
  export let editable = true;

  // -----------------------
  // Internal
  // -----------------------

  const dispatcher = createEventDispatcher();
  let _element;
  let showActions; /* used on mobile */

  const clickHandler = device.isMobile
    ? () => (showActions = !showActions)
    : () => {};

  function hideActions() {
    device.isMobile && (showActions = false);
  }

  function globalHideHandler(evt) {
    if (!showActions) {
      return;
    }

    const target = evt.target;
    const elementTouched =
      _element && (target == _element || _element.contains(target));

    if (!elementTouched) {
      hideActions();
    }
  }

  function dispatch(name) {
    dispatcher(name, { event });
    hideActions();
  }
</script>

<style>
  .eventtimer .eventtimer__actions {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -50px;
    z-index: 10;
    background: transparent;
    padding: 1em 0;
  }

  .eventtimer.hover .eventtimer__actions,
  .eventtimer.useHover:hover .eventtimer__actions {
    display: inline;
  }

  .flip {
    transform: scale(-1, 1);
  }

  div.xs {
    width: 12px;
    height: auto;
  }
</style>

<svelte:window
  on:click|capture={globalHideHandler}
  on:touchstart|capture={globalHideHandler} />

<div
  bind:this={_element}
  class="eventtimer relative w-full text-center mb-8 {device.isDesktop ? 'useHover' : ''}"
  class:hover={showActions}>

  <TimeCounter
    class="bg-gray-200 border border-gray-400 rounded shadow-md"
    positiveClass="text-gray-900"
    negativeClass="text-gray-600"
    title={event.name}
    date={moment(event.date).local()}
    let:inFuture
    on:click={clickHandler}>
    on:touchstart={clickHandler}>
    <div
      class="pl-1 xs"
      slot="action"
      class:flip={inFuture}
      class:text-gray-600={inFuture}
      class:text-gray-400={!inFuture}>
      <ArrowLeft />
    </div>
  </TimeCounter>

  {#if editable}
    <div class="eventtimer__actions">
      <button
        class="bg-white text-xs hover:bg-blue-500 text-blue-700 hover:text-white
        py-1 px-2 border border-blue-500 hover:border-transparent rounded"
        on:click={() => dispatch('edit')}>
        edit
      </button>
      <button
        class="bg-white text-xs hover:bg-red-500 text-red-700 hover:text-white
        py-1 px-2 border border-red-500 hover:border-transparent rounded"
        on:click={() => dispatch('delete')}>
        delete
      </button>
    </div>
  {/if}

</div>