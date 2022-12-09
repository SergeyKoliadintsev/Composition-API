import { defineStore } from "pinia";
import { INewUser } from "../user";

interface UsersState {
  currentUserId?: string;
}

export const useUsers = defineStore("users", {
  state: (): UsersState => ({
    currentUserId: undefined,
  }),

  actions: {
    async authenticate() {
      try {
        const res = await fetch("/api/current-user", {
          headers: {
            "Content-type": "application/json",
          },
        });
        const result = await res.json();
        this.currentUserId = result.id;
      } catch (e) {
        this.currentUserId = undefined;
      }
    },

    async Login(newUser: INewUser) {
      const body = JSON.stringify(newUser);
      await fetch("/api/users", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body,
      });
      return this.authenticate();
    },

    async createUser(newUser: INewUser) {
      const body = JSON.stringify(newUser);
      await fetch("/api/users", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body,
      });
    },

    async logout() {
      await fetch("/api/logout", {
        method: "post",
        headers: { "Content-Type": "application/json" },
      });
      return this.authenticate();
    },
  },
});
