<script>
  import { createEventDispatcher } from "svelte";
  // -----------------------
  // Properties
  // -----------------------
  let className = "";
  export { className as class };
  export let disabled = false;
  export let checked = false;

  // -----------------------
  // Internal
  // -----------------------
  const dispatcher = createEventDispatcher();

  function toggleSwitch() {
    if (disabled) {
      return;
    }
    checked = !checked;
    dispatcher("change", { checked });
  }
</script>

<style>
  .switch {
    min-width: 30px;
    min-height: 17px;
  }

  .wrap {
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 17px;
    top: 0;
    left: 0;
  }

  .wrap input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .wrap .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #4299e1;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #4299e1;
  }

  input:disabled + .slider {
    background-color: #e1e1e1;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 17px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .switchBlocker {
    background: transparent;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 99;
    right: 0px;
    top: 0px;
  }
</style>

<div class="switch relative {className}" on:mousedown={() => toggleSwitch()}>
  <label class="wrap">
    <input type="checkbox" bind:checked readOnly={true} {disabled} />
    <span class="slider round" />
  </label>
  <div class="switchBlocker" />
</div>
