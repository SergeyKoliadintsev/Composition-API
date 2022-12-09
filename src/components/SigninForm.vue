<script lang="ts" setup>
import { ref } from "vue";
import { useModal } from "../composables/modal";
import { useUsers } from "../store/users";
import { INewUser } from "../user";

import UserForm from "./UserForm.vue";
const usersStore = useUsers();
const modal = useModal();
const error = ref("");

async function handleSignin(newUser: INewUser) {
  const body = JSON.stringify(newUser);
  const res = await fetch("/api/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if ([401, 404].includes(res.status)) {
    error.value = "User name or password was invalid";
  } else {
    usersStore.authenticate();
    modal.hideModal();
  }
  // return this.authenticate();
}
</script>

<template>
  <UserForm @submit="handleSignin" :error="error" />
</template>
