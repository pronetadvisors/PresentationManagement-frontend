<template>
<div>
  <div v-if="!settings" class="h-screen p-10" style="background-color: #fff">
    <div id=logo class="w-1/3 float-left"><img
      src="@/assets/APSARD_logo.jpg"
      alt="Logo"
      class="max-w-full align-center mx-auto"
    /></div>
    <div class="w-2/3 float-right grid grid-cols-5 gap-4 mb-5 mt-5 pb-5 border-b-2 border-[#262262]">
      <div class="text-[#d01c3b] text-left col-span-2">
        <h1 class="text-6xl font-light">
          {{ date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) }}
        </h1>
        <h2 class="text-3xl font-light text-[#d01c3b] underline">
          {{ day }}, {{ month }} {{ date.getDate() }}
        </h2>
      </div>
      <div class="text-[#d01c3b] text-right col-span-3">
        <h2 class="text-6xl">{{ selectedLocation }}</h2>
      </div>
    </div>

    <display-content :presentations="presentations" :offset="offset" />

    <div>
      <div class="absolute inset-x-0 bottom-10 p-3">
        <div class="flex flex-wrap">
          <img
            v-for="sponsor in selectedSponsors"
            alt="Sponsor Logo"
            :src="`${img_url}/images/sponsors/${sponsor.sponsor}`"
            class="max-h-40 align-center mx-auto"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="m-10">
    <h1 class="text-2xl">Digital Display Setup</h1>
    <br />
    <form>
      <label for="room"
        >Selection which location this display is located at:
      </label>
      <select id="room" v-model="selectedLocation" name="room">
        <option
          v-for="location in locations"
          :id="location.id"
          :value="location"
        >
          {{ location }}
        </option>
      </select>
      <br />
      <br />
      <label for="offset">
        Enter the number of offset in days: Eg. to advance one day, enter "1"
      </label>
      <input
          id="offset"
          v-model="offset"
          type="text"
          name="offset"
          placeholder="1"
          class="border border-2 border-black bg-gray-200"
          required
      />
      <br />
      <br />

      <h1 class="text-lg">
        Select the sponsors you want to appear on this display:
      </h1>
      <div class="flex flex-wrap">
        <div v-for="sponsor in sponsors" :id="sponsor" class="m-2">
          <input
            :id="sponsor.sponsor"
            type="checkbox"
            :name="sponsor.sponsor"
            @click="sponsor.active = !sponsor.active"
          />
          <label
            :for="sponsor.sponsor"
            :class="{
              'border border-4 border-[#262262] opacity-50': sponsor.active,
            }"
            class="flex"
            :style="`background-image: url('${img_url}/images/sponsors/${sponsor.sponsor}'); display:inline-block;padding: 0 0 0 0px;`"
          ></label>
        </div>
      </div>

      <br /><br />
      <button
        type="submit"
        class="text-[#d01c3b] font-light focus:ring-4 focus:ring-zinc-800 font-medium rounded-md text-sm px-5 py-2.5 m-2 mx-auto bg-zinc-500 hover:text-emerald-500 hover:bg-zinc-800 hover:border-emerald-500 transition duration-200"
        @click="onSubmit"
      >
        Save Settings
      </button>
    </form>
  </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

// ICONS
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import DisplayContent from "@/components/DisplayContent.vue";

// STORES
import { usePresentationStore } from "@/stores/presentations.js";

library.add(faCalendar);

const presentationStore = usePresentationStore();
presentationStore.updateDB();

const locations = computed(() => presentationStore.getLocation);
// const titles = computed(() => presentationStore.getTitle);
const sponsors = computed(() => presentationStore.getSponsors);
const img_url = ref(import.meta.env.VITE_API_URL || "");
const settings = ref(true);

const selectedLocation = ref(null);
const offset = ref(0);
const selectedSponsors = ref([]);

const date = ref(new Date());
const month = ref(null);
const day = ref(null);

const presentations = computed(() =>
  presentationStore.getPresentationsAt(selectedLocation)
);

function onSubmit() {
  if (selectedLocation.value != null) {
    sponsors.value.forEach((sponsor) => {
      if (sponsor.active) {
        selectedSponsors.value.push(sponsor);
      }
    });
    settings.value = false;
  } else {
    alert("Location must be selected.");
  }
}

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

<style scoped>
li {
  cursor: pointer;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  width: 200px;
  height: 200px;
  display: inline-block;
  padding: 0 0 0 0;
  background-size: 100% 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
#scrollarea::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#scrollarea {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
