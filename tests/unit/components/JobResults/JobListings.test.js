import { render, screen } from "@testing-library/vue";
import JobListings from "@/components/JobResults/JobListings.vue";
import { RouterLinkStub } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useJobsStore } from "@/stores/jobs";
import { useRoute } from "vue-router";

vi.mock("vue-router");
describe("JobListings", () => {
  const renderJobListings = () => {
    const pinia = createTestingPinia();
    render(JobListings, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };

  it("fetches jobs", () => {
    useRoute.mockReturnValue({
      query: {},
    });

    renderJobListings();
    const jobStore = useJobsStore();
    expect(jobStore.FETCH_JOBS).toHaveBeenCalled();
  });

  it("displays maximum of 10 jobs", async () => {
    useRoute.mockReturnValue({
      query: { page: "1" },
    });
    renderJobListings();
    const jobStore = useJobsStore();
    jobStore.jobs = Array(15).fill({});
    const jobListings = await screen.findAllByRole("listitem");
    expect(jobListings).toHaveLength(10);
  });

  describe("when params exclude page number", () => {
    it("displays page number 1", () => {
      useRoute.mockReturnValue({
        query: { page: undefined },
      });
      renderJobListings();
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });
  });

  describe("when params include page number", () => {
    it("displays page number", () => {
      useRoute.mockReturnValue({
        query: { page: "3" },
      });
      renderJobListings();
      expect(screen.getByText("Page 3")).toBeInTheDocument();
    });
  });
  describe("when user is on first page", () => {
    it("does not show link to previous page", async () => {
      useRoute.mockReturnValue({
        query: { page: "1" },
      });
      renderJobListings();
      const jobStore = useJobsStore();
      jobStore.jobs = Array(15).fill({});
      await screen.findAllByRole("listitem");
      const previousLink = screen.queryByRole("link", {
        name: /previous/i,
      });
      expect(previousLink).not.toBeInTheDocument();
    });

    it("show link to next page", async () => {
      useRoute.mockReturnValue({
        query: { page: "1" },
      });
      renderJobListings();
      const jobStore = useJobsStore();
      jobStore.jobs = Array(15).fill({});
      await screen.findAllByRole("listitem");
      // a tag without href will not consider a link so we need to add role=link on the element
      const nextLink = screen.queryByRole("link", {
        name: /next/i,
      });
      expect(nextLink).toBeInTheDocument();
    });
  });

  describe("when user is on last page", () => {
    it("does not show link to next page", async () => {
      useRoute.mockReturnValue({
        query: { page: "2" },
      });

      renderJobListings();
      const jobStore = useJobsStore();
      jobStore.jobs = Array(15).fill({});

      await screen.findAllByRole("listitem");
      // a tag without href will not consider a link se we need to add role=link on the element
      const nextLink = screen.queryByRole("link", {
        name: /next/i,
      });
      expect(nextLink).not.toBeInTheDocument();
    });
    it("show link to previous page", async () => {
      useRoute.mockReturnValue({
        query: { page: "2" },
      });
      renderJobListings();
      const jobStore = useJobsStore();
      jobStore.jobs = Array(15).fill({});
      await screen.findAllByRole("listitem");
      const previousLink = screen.queryByRole("link", {
        name: /previous/i,
      });
      expect(previousLink).toBeInTheDocument();
    });
  });
});
