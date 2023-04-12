<template>
  <!--  <div class="absolute">-->
  <!--    <div class="">-->
  <!--      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">-->
  <!--        <div class="absolute overflow-hidden">-->
  <!--          <div class="absolute top-0 left-0">-->
  <!--            <Logo />-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="mx-10" v-if="sortedPresentations[selectedPresentation]">
    <div class="w-full text-center py-6 border-b-2 border-green-800">
      <h1 class="text-6xl font-bold">
        {{ sortedPresentations[selectedPresentation].title }}
      </h1>
    </div>
    <div class="grid grid-cols-10 border-b-2 border-green-800">
      <div class="col-span-2 py-10 border-r-2 border-green-800">
        <div class="flex flex-col h-full min-h-[600px] justify-between">
          <h1 class="text-3xl font-light">
            {{ day }}, {{ month }} {{ date.getDate() }}
            <br />
            {{
              date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </h1>
          <div>
            <p class="text-xl">Presentation Time:</p>
            <h2 class="text-3xl font-light underline">
              {{
                new Date(
                  sortedPresentations[selectedPresentation].time
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
              -
              {{
                new Date(
                  sortedPresentations[selectedPresentation].endtime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h2>
          </div>
          <h1 class="font-bold text-3xl">{{ selectedLocation }}</h1>
          <a
            v-if="sortedPresentations[selectedPresentation].powerpoint"
            class="text-white font-light focus:ring-4 focus:ring-zinc-800 font-medium rounded-md text-sm px-5 py-2.5 ml-2 mt-1 mx-auto bg-zinc-500 hover:text-emerald-500 hover:bg-zinc-800 hover:border-emerald-500 transition duration-200"
            :href="`${api_url}/images/${sortedPresentations[selectedPresentation].powerpoint}`"
            target="_blank"
          >
            Download Presentation
          </a>
        </div>
      </div>
      <div class="col-span-8 p-10 flex flex-col justify-between">
        <h3
          class="text-6xl"
          v-for="(speak, idx) in sortedPresentations[
            selectedPresentation
          ].speaker.split(',')"
          :key="idx"
        >
          {{ speak }}
        </h3>
        <p class="text-xl">
          {{ sortedPresentations[selectedPresentation].description }}
        </p>
      </div>
    </div>
    <div class="flex mx-20 py-5 justify-between text-center">
      <button
        class="text-2xl disabled:text-gray-400"
        :disabled="selectedPresentation == 0"
        @click="selectedPresentation -= 1"
      >
        &lt; Previous Session
      </button>
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
          <option value="SELECT LOCATION" selected>SELECT LOCATION</option>
          <option
            v-for="location in locations"
            :id="location.id"
            :value="location"
          >
            {{ location }}
          </option>
        </select>
      </label>
      <button
        class="text-2xl disabled:text-gray-400"
        :disabled="selectedPresentation == sortedPresentations.length - 1"
        @click="selectedPresentation += 1"
      >
        Next Session >
      </button>
    </div>
  </div>
  <div v-else class="w-full mx-auto text-center my-20 justify-center">
    <div class="mx-auto max-w-[200px]">
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
          <option value="SELECT LOCATION" selected>SELECT LOCATION</option>
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
    <h1 class="text-6xl font-bold" v-if="selectedLocation == 'SELECT LOCATION'">
      Select a room
    </h1>
    <h1 class="text-6xl font-bold" v-else>No presentations today or at all</h1>
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
const selectedPresentation = ref(0);

const presentations = computed(() => presentationStore.getPresentations);
const locations = computed(() => presentationStore.getLocation);

const presentationsInRoom = computed(() => {
  return presentations.value.filter((row) => {
    const room = row.location.toLowerCase();
    const roomTerm = selectedLocation.value.toLowerCase();

    return room === roomTerm;
  });
});

// Filter presentations that just take place today
const filteredPresentations = computed(() => {
  return presentationsInRoom.value.filter((row) => {
    const time = new Date(row.time);

    return (
      time.getDate() === date.value.getDate() &&
      time.getMonth() === date.value.getMonth() &&
      time.getFullYear() === date.value.getFullYear()
    );
  });
});

const sortedPresentations = computed(() => {
  return filteredPresentations.value.sort((a, b) => {
    return new Date(a.time) - new Date(b.time);
  });
});

function updateRoomParam(name) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", name);
  window.history.pushState({}, "", url);

  sortedPresentations.value.forEach((presentation, idx) => {
    if (
      new Date(presentation.time) < date.value &&
      new Date(presentation.endtime) > date.value
    ) {
      selectedPresentation.value = idx;
    }
  });
  console.log(selectedPresentation.value);
}

watch(selectedLocation, (newVal, oldVal) => {
  updateRoomParam(newVal);
});

// presentationStore.getters.getPresentations()
onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const roomParam = queryParams.get("room");
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
