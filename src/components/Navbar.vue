<script setup lang="ts">
import { computed, ref } from "vue";
import { useModal } from "../composables/modal";
import SignupForm from "./UserForm.vue";
import { useUsers } from "../store/users";

const modal = useModal();
const userStore = useUsers();
</script>

<template>
  <div class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="userStore.currentUserId">
        <RouterLink to="/posts/new" class="button">New Post</RouterLink>
        <button class="button" @click="userStore.logout">Log out</button>
      </div>

      <div class="buttons" v-else>
        <button class="button" @click="modal.showModal('signUp')">
          Sign Up
        </button>
        <button class="button" @click="modal.showModal('signIn')">
          Sign In
        </button>
      </div>
    </div>
  </div>

  <Teleport to="#modal">
    <component :is="modal.component.value" />
  </Teleport>
</template>
