<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { TimeLinePost } from "../posts";
import { marked } from "marked";
import highlightjs from "highlight.js";
import debounce from "lodash/debounce";
import { usePosts } from "../store/posts";
import { useRouter } from "vue-router";

const postStore = usePosts();
const router = useRouter();

const props = defineProps<{ post: TimeLinePost }>();

const title = ref(props.post.title);
const content = ref(props.post.markdown);
const html = ref("");
const contentEditable = ref<HTMLDivElement>();

function parseHtml(markdown: string) {
  marked.parse(
    markdown,
    {
      gfm: true,
      breaks: true,
      highlight: (code) => {
        return highlightjs.highlightAuto(code).value;
      },
    },
    (err, parseResult) => {
      html.value = parseResult;
    }
  );
}

watch(
  content,
  debounce((newContent) => {
    parseHtml(newContent);
  }, 500),
  {
    immediate: true,
  }
);

onMounted(() => {
  if (!contentEditable.value) {
    throw Error("ContentEditable  DOM node was not found");
  }
  contentEditable.value.innerText = content.value;
});

function handleInput() {
  if (!contentEditable.value) {
    throw Error("ContentEditable  DOM node was not found");
  }
  content.value = contentEditable.value?.innerText;
}

async function handleClick() {
  const newPost: TimeLinePost = {
    ...props.post,
    title: title.value,
    markdown: content.value,
    html: html.value,
  };
  await postStore.createPost(newPost);
  router.push("/");
}
</script>

<template>
  <div>
    <div class="columns">
      <div class="column">
        <RouterLink to="/" class="button"> All posts </RouterLink>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="label">Post title</div>
          <input type="text" class="input" v-model="title" />
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div contenteditable ref="contentEditable" @input="handleInput" />
      </div>
      <div class="column"><div v-html="html" /></div>
    </div>

    <div class="columns">
      <div class="column">
        <button class="button is-primary is-pulled-right" @click="handleClick">
          Save Post
        </button>
      </div>
    </div>
  </div>
</template>
