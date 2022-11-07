<template>
  <div
    id="scrollarea"
    class="max-h-[1200px] overflow-scroll scroll-smooth scroll-auto text-white"
  >
    <!--    Today -->
    <div
      v-for="presentation in presentationsDisplayed"
      :key="presentation.id"
      class="text-white"
    >
      <div :class="`slot-${presentation.id}`">
        <div
          v-if="new Date(presentation.time).getDate() === date.getDate() + parseInt(offset)"
          class="pb-2 border-b-2 border-green-700"
        >
          <div class="pt-0 flex">
            <!-- In Progress  -->
            <h2
              v-if="
                new Date(presentation.time) < date &&
                new Date(presentation.endTime) > date
              "
              class="text-3xl text-white mx-5"
            >
              In Progress
            </h2>
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
            class="text-5xl my-5"
          >
            - {{ title }}
          </h2>
        </div>
      </div>
    </div>
    <!-- Tomorrow -->
    <div v-if="endOfDay">
      <h1 class="text-5xl">Starting Tomorrow:</h1>
      <div
        v-for="presentation in presentationsDisplayed"
        :key="presentation.id"
        class="text-white"
      >
        <div :class="`slot-${presentation.id}`">
          <div
            v-if="new Date(presentation.time).getDate() === date.getDate() + 1 + parseInt(offset)"
            class="pb-2 border-b-2 border-green-700"
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
              class="text-5xl my-5"
            >
              - {{ title }}
            </h2>
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

// CHANGE THIS CONFIG PER EVENT BASED ON WHAT SHOULD BE DISPLAYED
const presentationsDisplayed = computed(() => {
  const filteredPresentations = [];
  for (const pres of presentations.value) {
    let passBy = false;
    filteredPresentations.forEach((presentation) => {
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
    const presentation = {
      id: pres.id,
      title: group,
      time: pres.time,
      endTime: pres.endtime,
    };
    filteredPresentations.push(presentation);
  }
  return filteredPresentations;
});

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

let elements = document.querySelectorAll("[class^=slot-]");
onUpdated(() => {
  elements = document.querySelectorAll("[class^=slot]");
});
let active = 0;
setInterval(() => {
  if (elements.length === 0) return;
  if (++active >= elements.length) active = 0;
  // poor support for options
  elements[active].scrollIntoView({
    behavior: "smooth",
    block: "start", // Where to align current item: 'start', 'end' or 'center'
  });
}, 5000);
</script>

<style scoped>
[class^="slot-"] {
  margin-bottom: 10px;
}
</style>
