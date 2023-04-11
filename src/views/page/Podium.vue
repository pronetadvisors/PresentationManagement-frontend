<template>
  <div class="flex flex-col">
    <div class="">
      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div class="flex overflow-hidden">
          <div class="flex">
            <Logo />
            <label
              for="room"
              class="ml-4 block relative flex items-center text-zinc-300 focus-within:text-emerald-400"
            >
              <select
                id="room"
                v-model="selectedLocation"
                name="room"
                class="pr-3 mt-1 block w-full px-3 py-2.5 bg-zinc-400 border border-zinc-600 rounded-md text-sm text-zinc-600 shadow-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              >
                <option value="SELECT LOCATION" selected>
                  SELECT LOCATION
                </option>
                <option
                  v-for="location in locations"
                  :id="location.id"
                  :value="location"
                >
                  {{ location }}
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex">
    <div
      class="w-full mx-20 grid grid-cols-5 gap-4 mb-5 mt-5 pb-5 border-b-2 border-emerald-700"
    >
      <div class="text-left col-span-2">
        <h1 class="text-6xl font-light">
          {{
            date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </h1>
        <h2 class="text-3xl font-light underline">
          {{ day }}, {{ month }} {{ date.getDate() }}
        </h2>
      </div>
      <div class="text-right col-span-3">
        <h2 class="text-6xl">{{ selectedLocation }}</h2>
      </div>
    </div>
  </div>
  <div class="mx-20">
    <div
      v-for="presentation in filteredPresentations"
      :key="presentation.id"
      class="border-b-2 py-3"
    >
      <div class="flex flex-row pb-1 w-full">
        <div class="flex justify-between w-full">
          <h1 class="text-3xl text-slate-600">
            {{
              new Date(presentation.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
            -
            {{
              new Date(presentation.endtime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </h1>
          <h2
            v-if="
              new Date(presentation.time) < date &&
              new Date(presentation.endtime) > date
            "
            class="text-2xl text-blue-500"
          >
            In Progress
          </h2>
          <h2 v-else class="text-2xl">Coming Up</h2>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex">
          <h1 class="text-3xl mx-2 font-semibold">{{ presentation.title }}</h1>
          <h2 class="text-2xl mt-1">By: {{ presentation.speaker }}</h2>
        </div>
        <div>
          <a
            class="text-white font-light focus:ring-4 focus:ring-zinc-800 font-medium rounded-md text-sm px-5 py-2.5 ml-2 mt-1 mx-auto bg-zinc-500 hover:text-emerald-500 hover:bg-zinc-800 hover:border-emerald-500 transition duration-200"
            :href="`${api_url}/images/${presentation.powerpoint}`"
            target="_blank"
          >
            Download Presentation
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ICONS
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

// COMPONENTS
import { computed, onMounted, ref, watch } from "vue";
import Logo from "@/components/Logo.vue";
// STORES
import { usePresentationStore } from "@/stores/presentations.js";

library.add(faMagnifyingGlass);

const presentationStore = usePresentationStore();
presentationStore.updateDB();

const selectedLocation = ref("SELECT LOCATION");

const presentations = computed(() => presentationStore.getPresentations);
const locations = computed(() => presentationStore.getLocation);

const presentationsInRoom = computed(() => {
  return presentations.value.filter((row) => {
    const room = row.location.toLowerCase();
    const roomTerm = selectedLocation.value.toLowerCase();

    return room === roomTerm;
  });
});

const filteredPresentations = computed(() => {
  return presentationsInRoom.value;
});

function updateRoomParam(name) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", name);
  window.history.pushState({}, "", url);
}

watch(selectedLocation, (newVal, oldVal) => {
  updateRoomParam(newVal);
});

// presentationStore.getters.getPresentations()
onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const roomParam = queryParams.get("room");
  console.log("Example parameter:", roomParam);
  if (roomParam != null) {
    selectedLocation.value = roomParam;
  }
});

const api_url = ref(import.meta.env.VITE_API_URL || "");

const date = ref(new Date());
const month = ref(null);
const day = ref(null);

const months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

setInterval(() => {
  date.value = new Date();
  day.value = days[date.value.getDay()];
  month.value = months[date.value.getMonth()];
}, 1000);
</script>

<style scoped></style>
