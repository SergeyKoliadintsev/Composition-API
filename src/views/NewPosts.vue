<script setup lang="ts">
import { DateTime } from "luxon";
import PostWriterVue from "../components/PostWriter.vue";
import { TimeLinePost } from "../posts";

const post: TimeLinePost = {
  id: "-1",
  title: "Title",
  created: DateTime.now(),
  markdown: "## Title",
  html: "<h1>Title</h1>",
};
</script>

<template>
  <div>
    <PostWriterVue :post="post" />
  </div>
</template>
