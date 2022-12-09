<script lang="ts" setup>
import { useModal } from "../composables/modal";
import { useUsers } from "../store/users";
import { INewUser } from "../user";

import UserForm from "./UserForm.vue";
const usersStore = useUsers();
const modal = useModal();

async function handleSignup(newUser: INewUser) {
  await usersStore.createUser(newUser);
  modal.hideModal();
}
</script>

<template>
  <UserForm @submit="handleSignup" />
</template>
