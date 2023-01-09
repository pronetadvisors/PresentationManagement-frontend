<template>
  <!-- scrolling DIV removed <div id="scrollarea" class="max-h-[1200px] overflow-scroll scroll-smooth scroll-auto text-[#d01c3b]"> -->
  <div class="relative pt-[200px]">
    <!--    Today -->
    <div
      v-for="timeRange in Object.keys(presen)"
      :key="timeRange"
      class="text-[#d01c3b]"
    >
      <div :class="`slot-${timeRange}`">
        <div
          v-if="new Date(presen[timeRange][0].time).getDate() === date.getDate() + parseInt(offset) && date <= new Date(presen[timeRange][0].endtime)"
          class="pb-2 border-b-2 text-3border-[#262262]"
        >

          <div class="pt-0 flex">
            <!-- In Progress  -->
            <h2
              v-if="
                new Date(presen[timeRange][0].time) < date &&
                new Date(presen[timeRange][0].endtime) > date
              "
              class="text-3xl text-[#d01c3b] mx-5"
            >
              In Progress
            </h2>
            <h2 class="text-3xl">
              {{
                new Date(presen[timeRange][0].time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
              -
              {{
                new Date(presen[timeRange][0].endtime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h2>
          </div>
        <h3
            class="text-3xl text-[#d01c3b] my-5"
          >
            &#x2022; {{ presen[timeRange][0].title }}
          </h3>
          <h1
            v-for="presentation in presen[timeRange]"
            :key="presentation.id"
            class="text-3xl my-2"
            >
            &nbsp;
            <a
                v-if="presentation.powerpoint"
                class="text-lg text-blue-500"
                :href="`${api_url}/images/${presentation.powerpoint}`"
            >
              {{ presentation.speaker }}
            </a>
            <span v-else class="text-lg text-black">{{ presentation.speaker }}</span>
          </h1>
        </div>
      </div>
    </div>
    <!-- Tomorrow -->
    <div v-if="endOfDay && tomorrowCount > 0">
      <h1 class="text-5xl">Starting Tomorrow:</h1>
      <div
        v-for="presentation in presentationsDisplayed"
        :key="presentation.id"
        class="text-[#d01c3b]"
      >
        <div :class="`slot-${presentation.id}`">
          <div
            v-if="new Date(presentation.time).getDate() === date.getDate() + 1 + parseInt(offset)"
            class="pb-2 border-b-2 text-border-[#262262]"
          >
            <div class="pt-0 flex">
              <h2 class="text-3xl">
                {{
                  new Date(presentation.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
                -
                {{
                  new Date(presentation.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </h2>
            </div>
            <h2
              v-for="title in presentation.title"
              :key="title.id"
              class="text-3xl text-[#d01c3b] my-5"
            >
              &#x2022; {{ title }}
            </h2>
            <h4
              v-for="speaker in presentation.speaker"
              :key="speaker.id"
              class="text-3xl text-[#d01c3b] my-5"
              >
              &#x2022; {{ speaker }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onUpdated, ref } from "vue";

const props = defineProps(["presentations", "offset"]);
const offset = ref(props.offset);
const presentations = ref(props.presentations);
const date = ref(new Date());
const api_url = ref(import.meta.env.VITE_API_URL || "");

setInterval(() => {
  date.value = new Date();
}, 1000); // 10 Minutes

console.log(presentations.value)

// CHANGE THIS CONFIG PER EVENT BASED ON WHAT SHOULD BE DISPLAYED
const presentationsDisplayed = computed(() => {
  const filteredPresentations = [];
  for (const pres of presentations.value) {
    let passBy = false;
    filteredPresentations.forEach((presentation) => {
      if(presentation.id === pres.id) passBy = true;
       presentation.title.forEach((title) => {
         if (title === pres.title) passBy = true;
       });
    });
    if (passBy) {
      continue;
    }
    const group = [pres.title];
    for (const subPres of presentations.value) {
      if (subPres.id === pres.id) {
        continue;
      }
      if (subPres.time === pres.time && subPres.endtime === pres.endtime) {
        group.push(subPres.title);
      }
    }
    const talk = [pres.speaker];
    for (const subPres of presentations.value) {
      if (subPres.id === pres.id) {
        continue;
      }
      if (subPres.time === pres.time && subPres.endtime === pres.endtime) {
        talk.push(subPres.speaker);
      }
    }
    const presentation = {
      id: pres.id,
      title: group,
      speaker: talk,
      time: pres.time,
      endTime: pres.endtime,
      presentation: pres.presentation
    };
    filteredPresentations.push(presentation);
  }
  return filteredPresentations;
});

const presen = computed(() => {
  const pres = {};
  console.log(presentations.value)
  for (const presentation of presentations.value) {
    if (pres[presentation.time + " " + presentation.endtime] === undefined) {
      pres[presentation.time + " " + presentation.endtime] = [presentation];
    } else {
      pres[presentation.time + " " + presentation.endtime].push(presentation);
    }
  }
  console.log(pres);
  return pres
})

const endOfDay = computed(() => {
  let left = 0;
  for (const presentation of presentationsDisplayed.value) {
    // Checks for todays presentations
    if (new Date(presentation.time).getDate() === date.value.getDate() + parseInt(offset.value)) {
      //  Checks for any presentations that haven't passed
      if (new Date(presentation.endTime) > date.value) {
        left++;
      }
    }
  }
  return left < 2;
});
// END AREA

const tomorrowCount = computed(() => {
  let count = 0;
  for (const presentation of presentationsDisplayed.value) {
    // Checks for tomorrow's presentations
    if (new Date(presentation.time).getDate() === date.value.getDate() + 1 + parseInt(offset.value)) {
      count ++;
    }
  }
  return count;
});

let elements = document.querySelectorAll("[class^=slot-]");
onUpdated(() => {
  elements = document.querySelectorAll("[class^=slot]");
});
//let active = 0;
//setInterval(() => {
//  if (elements.length === 0) return;
//  if (++active >= elements.length) active = 0;
  // poor support for options
//  elements[active].scrollIntoView({
//    behavior: "smooth",
//    block: "start", // Where to align current item: 'start', 'end' or 'center'
//  });
//}, 0);
</script>

<style scoped>
[class^="slot-"] {
  margin-bottom: 10px;
}
</style>
