import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import { createPinia } from "pinia";

/* Notifications */
import Notifications from "@kyvg/vue3-notification";

/* TailwindCSS */
import "./index.css";

/* Icons */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* Date Picker */
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const pinia = createPinia();

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("vue-date-picker", VueDatePicker)
  .use(pinia)
  .use(router)
  .use(Notifications)
  .mount("#app");
