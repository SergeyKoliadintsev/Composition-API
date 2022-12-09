import { createRouter, createWebHistory } from "vue-router";
import HomeVue from "./views/Home.vue";
import NewPost from "./views/NewPosts.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomeVue,
    },
    {
      path: "/posts/new",
      component: NewPost,
    },
  ],
});
