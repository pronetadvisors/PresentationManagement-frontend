<template>
  <button
    class="text-white font-light focus:ring-4 focus:ring-zinc-800 font-medium rounded-md text-sm px-5 py-2.5 ml-2 m-2 mx-auto bg-zinc-500 hover:text-emerald-500 hover:bg-zinc-800 hover:border-emerald-500 transition duration-200"
    type="button"
    @click="openModal"
  >
    Create Presentation
  </button>

  <div
    v-show="isOpen"
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/2">
      <div class="relative p-4 w-full h-full md:h-auto">
        <button
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          @click="isOpen = false"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="py-6 px-6 lg:px-8 text-left">
          <h3
            class="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center"
          >
            Create Presentation
          </h3>
          <form class="space-y-6" @submit.prevent="onSubmit">
            <div>
              <label
                for="session_id"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Presentation ID</label
              >
              <input
                v-model="session_id"
                type="text"
                name="session_id"
                placeholder="123"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Presentation Title</label
              >
              <input
                id="name"
                v-model="title"
                type="text"
                name="name"
                placeholder="Introduction to..."
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Presentation Description/subtitle</label
              >
              <textarea
                id="name"
                v-model="description"
                type="text"
                name="name"
                placeholder="A very important introduction to..."
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                for="speaker"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Speaker Name - Separate multiple by comma (eg. John Smith, Bob
                Adams)</label
              >
              <input
                id="speaker"
                v-model="speaker"
                type="text"
                name="speaker"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="John Adams"
                required
              />
            </div>
            <div class="grid grid-cols-3 gap-x-3">
              <div class="col-span-2">
                <label
                  for="location"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Location</label
                >
                <input
                  id="location"
                  v-model="location"
                  type="text"
                  name="location"
                  placeholder="Ballroom 1"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  for="date"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Date(YYYY-MM-DD)</label
                >
                <input
                  id="date"
                  v-model="date"
                  type="text"
                  name="date"
                  placeholder="YYYY-MM-DD"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-x-3">
              <div>
                <label
                  for="time"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Start Time(HH:MM)</label
                >
                <input
                  id="time"
                  v-model="time"
                  type="text"
                  name="time"
                  placeholder="HH:MM"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  for="time"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >End Time(HH:MM)</label
                >
                <input
                  id="time"
                  v-model="endtime"
                  type="text"
                  name="time"
                  placeholder="HH:MM"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
            </div>
            <div class="text-center">
              <button
                type="button"
                class="w-1/3 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-800 mr-10"
                @click="isOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                value="submit"
                class="w-1/3 text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-400 dark:hover:bg-emerald-500 dark:focus:ring-emerald-800"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// ICONS
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

// MISC
import { ref } from "vue";

// STORES
import { usePresentationStore } from "@/stores/presentations.js";

library.add(faPencil);
const isOpen = ref(false);
const session_id = ref("");
const date = ref("");
const time = ref("");
const endtime = ref("");
const location = ref("");
const title = ref("");
const description = ref("");
const speaker = ref("");
const presentationStore = usePresentationStore();

const startdate = new Date();

const enddate = new Date();

function openModal() {
  isOpen.value = true;
  window.scrollTo(0, 0);
}
async function onSubmit() {
  startdate.setFullYear(
    Number(date.value.substring(0, 4)),
    Number(date.value.substring(5, 7)) - 1,
    Number(date.value.substring(8, 10))
  );
  startdate.setHours(
    Number(time.value.substring(0, 2)),
    Number(time.value.substring(3, 5)),
    0
  );

  enddate.setFullYear(
    Number(date.value.substring(0, 4)),
    Number(date.value.substring(5, 7)) - 1,
    Number(date.value.substring(8, 10))
  );
  enddate.setHours(
    Number(endtime.value.substring(0, 2)),
    Number(time.value.substring(3, 5)),
    0
  );
  // console.log(startdate)
  // console.log(enddate)

  const presentation = {
    session_id: session_id.value,
    time: startdate.toISOString(),
    endtime: enddate.toISOString(),
    location: location.value,
    title: title.value,
    description: description.value,
    speaker: speaker.value,
  };
  // console.log(presentation);
  await presentationStore.createPresentation(presentation);
  isOpen.value = false;
}
</script>
