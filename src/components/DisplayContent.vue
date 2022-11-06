<template>
  <div
      id="scrollarea"
      class="max-h-[1200px] overflow-scroll scroll-smooth scroll-auto text-white"
  >
<!--    Today -->
    <div v-for="presentation in presentationsDisplayed" class="text-white">
      <div :class="`slot-${presentation.id}`">
        <div
            v-if="new Date(presentation.time).getDate() === date.getDate()"
            class=" pb-2 border-b-2 border-green-700"
        >
          <div class="pt-0 flex">
            <!-- In Progress  -->
            <h2
                v-if="
                  new Date(presentation.time) < date &&
                  new Date(presentation.endTime) > date
                "
                class="text-3xl text-white mx-5">
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
          <h2 class="text-5xl my-5" v-for="title in presentation.title">- {{ title }}</h2>
        </div>
      </div>
    </div>
    <!-- Tomorrow -->
    <div v-if="endOfDay">
      <h1 class="text-5xl">Starting Tomorrow...</h1>
      <div v-for="presentation in presentationsDisplayed" class="text-white">
        <div :class="`slot-${presentation.id}`">
          <div
              v-if="new Date(presentation.time).getDate() === date.getDate()+1"
              class=" pb-2 border-b-2 border-green-700"
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
            <h2 class="text-5xl my-5" v-for="title in presentation.title">- {{ title }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onUpdated, ref, defineProps, computed} from "vue";

const props = defineProps(["presentations"]);
const presentations = ref(props.presentations);
const date = ref(new Date());


//CHANGE THIS CONFIG PER EVENT BASED ON WHAT SHOULD BE DISPLAYED
const presentationsDisplayed = computed(() => {
  let filteredPresentations = [];
  for (let pres of presentations.value) {
    let passBy = false;
    filteredPresentations.forEach((presentation) => {
      presentation.title.forEach((title) => {
        if(title === pres.title) passBy = true;
      })
    })
    if(passBy) {
      continue;
    }
    let group = [pres.title];
    for (let subPres of presentations.value) {
      if (subPres.id === pres.id) {
        continue;
      }
      if (subPres.time === pres.time) {
        group.push(subPres.title);
      }
    }
    const presentation = {
      id: pres.id,
      title: group,
      time: pres.time,
      endTime: pres.endtime
    }
    filteredPresentations.push(presentation);
  }
  return filteredPresentations;
});

const endOfDay = computed(() => {
  let left = 0;
  for (let presentation of presentationsDisplayed.value) {
    //Checks for todays presentations
    if(new Date(presentation.time).getDate() === date.value.getDate()+3){
    //  Checks for any presentations that haven't passed
      if(new Date(presentation.endTime) > date.value){
        left++;
      }
    }
  }
  return left < 2;
})
//END AREA

var elements = document.querySelectorAll('[class^=slot-]');
onUpdated(() => {
  elements = document.querySelectorAll('[class^=slot]');
})
let active = 0;
setInterval(()=>{
  if(elements.length === 0) return;
  if( ++active >= elements.length) active = 0;
  //poor support for options
  elements[active].scrollIntoView({
    behavior:'smooth',
    block:'start' //Where to align current item: 'start', 'end' or 'center'
  })
},5000)
</script>

<style scoped>
[class^=slot-]{
  margin-bottom:10px;
}
</style>