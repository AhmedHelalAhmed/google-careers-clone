<template>
  <main class="flex-auto bg-brand-gray-2 p-8">
    <ol>
      <job-listing
        v-for="job in displayedJobs"
        :key="job.id"
        :job="job"
      ></job-listing>
    </ol>
    <div class="mx-auto mt-8">
      <div class="flex flex-row flex-nowrap">
        <p class="flex-grow text-sm">Page {{ currentPage }}</p>
        <div class="flex items-center justify-center">
          <router-link
            v-if="previousPage"
            :to="{ name: 'jobResults', query: { page: previousPage } }"
            class="mx-3 text-sm font-semibold text-brand-blue-1"
            role="link"
          >
            Previous
          </router-link>
          <router-link
            v-if="nextPage"
            :to="{ name: 'jobResults', query: { page: nextPage } }"
            class="mx-3 text-sm font-semibold text-brand-blue-1"
            role="link"
            >Next
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useJobsStore } from "@/stores/jobs";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import JobListing from "@/components/JobResults/JobListing.vue";
import usePreviousAndNextPages from "@/composables/usePreviousAndNextPages";
import { useDegreesStore } from "@/stores/degrees";

const pageSize = import.meta.env.VITE_PAGE_SIZE;
const jobsStore = useJobsStore();
onMounted(jobsStore.FETCH_JOBS);
const degreesStore = useDegreesStore();
onMounted(degreesStore.FETCH_DEGREES);

const route = useRoute();
const currentPage = computed(() =>
  Number.parseInt((route.query.page as string) || "1")
);
const FILTERED_JOBS = computed(() => jobsStore.FILTERED_JOBS);
const maxPage = computed(() =>
  Math.ceil(FILTERED_JOBS.value.length / pageSize)
);
const { nextPage, previousPage } = usePreviousAndNextPages(
  currentPage,
  maxPage
);
const displayedJobs = computed(() => {
  const firstJobIndex = (currentPage.value - 1) * pageSize;
  const lastJobIndex = currentPage.value * pageSize;
  return FILTERED_JOBS.value.slice(firstJobIndex, lastJobIndex);
});
</script>
