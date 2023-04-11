import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/page/Index.vue"),
  },
  {
    path: "/admin/",
    component: () => import("@/views/page/Presentations.vue"),
  },
  {
    path: "/uploader/",
    component: () => import("@/views/page/Uploader.vue"),
  },
  {
    path: "/rooms/",
    component: () => import("@/views/page/Rooms.vue"),
  },
  {
    path: "/displays",
    component: () => import("@/views/page/Displays.vue"),
  },
  {
    path: "/podium",
    component: () => import("@/views/page/Podium.vue"),
  },
  {
    path: "/demo/",
    component: () => import("@/views/page/DemoDisplay.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/page/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
