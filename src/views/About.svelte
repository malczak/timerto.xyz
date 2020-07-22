<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "app/components/Modal.svelte";
  import SvelteLogo from "app/components/icons/SvelteLogo.svelte";

  // package
  import pckg from "../../package.json";

  const dispatch = createEventDispatcher();

  const dependencies = [
    ...Object.keys(pckg.dependencies),
    ...Object.keys(pckg.devDependencies)
  ].filter(name => !["moment", "svelte", "now", "tailwindcss"].includes(name));

  const tools = [
    {
      link: "https://svelte.dev",
      name: "SVELTE",
      icon: { cls: SvelteLogo, props: { class: "svelte" } },
      desc: "Reactive Java Script framework."
    },
    {
      link: "https://momentjs.com",
      name: "Momentjs.com",
      desc: "Date manipulations library."
    },
    {
      link: "https://tailwindcss.com",
      name: "tailwindcss",
      desc: "A utility-first CSS framework."
    },
    {
      link: "https://undraw.co",
      name: "unDraw",
      desc: "Open-source illustrations."
    },
    {
      link: "https://fonts.google.com/specimen/Sedgwick+Ave",
      name: "Sedgwick Ave Font",
      desc: "Google Doodle Font."
    },
    {
      link:
        "https://dribbble.com/shots/3947538-Free-Sketch-mockups-Apple-devices#shot-description",
      name: "Device mockups",
      desc: "Free Sketch mockups: Apple devices"
    }
  ];
</script>

<style>
  .logo {
    display: inline-block;
    width: 16px;
    height: auto;
  }

  .logo .svelte {
    color: #ff3e00;
  }
</style>

<Modal>
  <slot>
    <div class="bg-white shadow-md rounded py-6">
      <div class="h-64 px-8 overflow-x-hidden overflow-y-scroll">
        {#each tools as tool}
          <div class="mb-3">
            <div>
              <div>
                <a
                  class="flex items-center"
                  href={tool.link}
                  title={tool.name}
                  target="_blank">
                  {#if tool.icon}
                    <div class="logo mx-1 inline-block">
                      <span {...tool.icon.props || {}}>
                        <svelte:component this={tool.icon.cls} />
                      </span>
                    </div>
                  {/if}
                  <span>{tool.name}</span>
                </a>
              </div>
            </div>
            <span class="text-gray-700 text-sm">{tool.desc}</span>
          </div>
        {/each}
        <hr class="h-2" />
        <label class="block text-gray-700 text-sm font-bold my-2">
          Other used libraries
        </label>
        {#each dependencies as name}
          <div class="mb-1">
            <a href={`https://www.npmjs.com/package/${name}`} target="_blank">
              {name}
            </a>
          </div>
        {/each}
        <div class="flex h-16 items-center justify-center ">
          <div class="text-gray-700 font-bold text-sm">Thanks 🍻!</div>
        </div>
      </div>
      <div class="flex justify-center mt-6">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
          rounded focus:outline-none focus:shadow-outline"
          type="button"
          on:click={() => dispatch('close')}>
          Close
        </button>
      </div>
    </div>
  </slot>
</Modal>
