<script setup lang="ts">
import { usePosts } from "../store/posts";
import TimelineItemVue from "./TimelineItem.vue";
import { periods } from "../constans";

const postStore = usePosts();

await postStore.fetchPosts();
</script>

<template>
  <div>
    <nav class="is-primary panel">
      <span class="panel-tabs">
        <a
          v-for="period of periods"
          :key="period"
          :class="{ 'is-active': period === postStore.selectedPeriod }"
          @click="postStore.setSelectedPeriod(period)"
        >
          {{ period }}
        </a>
      </span>
      <TimelineItemVue
        v-for="post of postStore.filteredPosts"
        :post="post"
        :key="post.id"
      />
    </nav>
  </div>
</template>
