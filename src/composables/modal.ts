import { ref, shallowRef } from "vue";
import SignupFormVue from "../components/SignupForm.vue";
import SigninFormVue from "../components/SigninForm.vue";

const show = ref(false);
const component = shallowRef();

export function useModal() {
  return {
    show,
    component,
    showModal: (type: "signIn" | "signUp") => {
      show.value = true;
      switch (type) {
        case "signIn":
          return (component.value = SigninFormVue);
        case "signUp":
          return (component.value = SignupFormVue);
      }
    },
    hideModal: () => (show.value = false),
  };
}
