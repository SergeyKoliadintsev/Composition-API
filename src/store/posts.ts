import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { Post, today, thisWeek, thisMonth, TimeLinePost } from "../posts";
import { IPeriod } from "../types/timeline";

interface IPostsState {
  ids: string[];
  all: Map<string, Post>;
  selectedPeriod: IPeriod;
}

function delay() {
  return new Promise<void>((res) => setTimeout(res, 1500));
}

export const usePosts = defineStore("posts", {
  state: (): IPostsState => ({
    ids: [today.id, thisWeek.id, thisMonth.id],
    all: new Map(),
    selectedPeriod: "Today",
  }),

  actions: {
    setSelectedPeriod(period: IPeriod) {
      this.selectedPeriod = period;
    },

    async fetchPosts() {
      const posts = await fetch("/api/posts");
      const data = (await posts.json()) as Post[];
      await delay();

      let ids: string[] = [];
      let all = new Map<string, Post>();
      for (const post of data) {
        ids.push(post.id);
        all.set(post.id, post);
      }
      this.ids = ids;
      this.all = all;
    },

    async createPost(post: TimeLinePost) {
      const body = JSON.stringify({ ...post, created: post.created.toISO() });
      return await fetch("/api/posts", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body,
      });
    },
  },

  getters: {
    filteredPosts: (state): TimeLinePost[] | undefined => {
      return state.ids
        .map((id) => {
          const post = state.all.get(id);
          return {
            ...post,
            created: DateTime.fromISO(post?.created),
          };
        })
        .filter((post) => {
          if (state.selectedPeriod === "Today") {
            return post.created >= DateTime.now().minus({ day: 1 });
          }
          if (state.selectedPeriod === "This Week") {
            return post.created >= DateTime.now().minus({ week: 1 });
          }
          return post;
        });
    },
  },
});
