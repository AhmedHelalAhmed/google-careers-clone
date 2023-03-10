import {
  ADD_SELECTED_DEGREES,
  ADD_SELECTED_JOB_TYPES,
  ADD_SELECTED_ORGANIZATIONS,
  useUserStore,
} from "@/stores/user";
import { createPinia, setActivePinia } from "pinia";
import { expect } from "vitest";
import { INCLUDE_JOB_BY_DEGREE, INCLUDE_JOB_BY_SKILL } from "@/stores/jobs";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("state", () => {
  it("keeps track of if user is logged in", () => {
    const store = useUserStore();
    expect(store.isLoggedIn).toBe(false);
  });

  it("stores organizations that user would like to filter jobs by", () => {
    const store = useUserStore();
    expect(store.selectedOrganizations).toEqual([]);
  });

  it("stores job types that the user would like to filter jobs by", () => {
    const store = useUserStore();
    expect(store.selectedJobTypes).toEqual([]);
  });

  it("stores degrees that the user would like to filter jobs by", () => {
    const store = useUserStore();
    expect(store.selectedDegrees).toEqual([]);
  });

  it("stores user's search term for skills and qualifications", () => {
    const store = useUserStore();
    expect(store.skillsSearchTerm).toEqual("");
  });
});

describe("actions", () => {
  describe("LOGIN_USER", () => {
    it("logs the user in", () => {
      const store = useUserStore();
      store.LOGIN_USER();
      expect(store.isLoggedIn).toBe(true);
    });
  });

  describe("ADD_SELECTED_ORGANIZATIONS", () => {
    it("updates organizations the user has chosen to filter jobs by", () => {
      const store = useUserStore();
      store.ADD_SELECTED_ORGANIZATIONS(["Org1", "Org2"]);
      expect(store.selectedOrganizations).toEqual(["Org1", "Org2"]);
    });
  });
  describe("ADD_SELECTED_JOB_TYPES", () => {
    it("updates job types the user has chosen to filter jobs by", () => {
      const store = useUserStore();
      store.ADD_SELECTED_JOB_TYPES(["Full-time", "Part-time"]);
      expect(store.selectedJobTypes).toEqual(["Full-time", "Part-time"]);
    });
  });
  describe("ADD_SELECTED_DEGREES", () => {
    it("updates degrees the user has chosen to filter jobs by", () => {
      const store = useUserStore();
      store.ADD_SELECTED_DEGREES(["Master's", "Bachelor's"]);
      expect(store.selectedDegrees).toEqual(["Master's", "Bachelor's"]);
    });
  });

  describe("UPDATE_SKILLS_SEARCH_TERM", () => {
    it("receives search term for skills the user has entered", () => {
      const store = useUserStore();
      store.skillsSearchTerm = "";

      store.UPDATE_SKILLS_SEARCH_TERM("Vue");
      expect(store.skillsSearchTerm).toBe("Vue");
    });
  });

  describe("CLEAR_USER_JOB_FILTER_SELECTIONS", () => {
    it("removes all job filters that user has chosen", () => {
      const store = useUserStore();
      store.selectedOrganizations = ["Org1", "Org2"];
      store.selectedJobTypes = ["Full-time", "Part-time"];
      store.selectedDegrees = ["Master's", "Bachelor's"];
      store.skillsSearchTerm = "vue developer";
      store.CLEAR_USER_JOB_FILTER_SELECTIONS();

      expect(store.selectedOrganizations).toEqual([]);
      expect(store.selectedJobTypes).toEqual([]);
      expect(store.selectedDegrees).toEqual([]);
      expect(store.skillsSearchTerm).toBe("");
    });
  });
});

describe("constants", () => {
  it("has ADD_SELECTED_JOB_TYPES", () => {
    expect(ADD_SELECTED_JOB_TYPES).toBe("ADD_SELECTED_JOB_TYPES");
  });
  it("has ADD_SELECTED_DEGREES", () => {
    expect(ADD_SELECTED_DEGREES).toBe("ADD_SELECTED_DEGREES");
  });
  it("has ADD_SELECTED_ORGANIZATIONS", () => {
    expect(ADD_SELECTED_ORGANIZATIONS).toBe("ADD_SELECTED_ORGANIZATIONS");
  });
});
