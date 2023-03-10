import { render, screen } from "@testing-library/vue";
import MainNav from "@/components/Navigation/MainNav.vue";
import userEvent from "@testing-library/user-event";
import { RouterLinkStub } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import type { Mock } from "vitest";

vi.mock("vue-router");
const useRouteMock = useRoute as Mock;
describe("MainNav", () => {
  const renderMainNav = () => {
    useRouteMock.mockReturnValue({ name: "home" });
    const pinia = createTestingPinia();
    render(MainNav, {
      global: {
        plugins: [pinia],
        stubs: {
          FontAwesomeIcon: true,
          RouterLink: RouterLinkStub,
        },
      },
    });
  };
  it("displays company name", () => {
    renderMainNav();
    const companyName = screen.getByText("Google Careers");
    expect(companyName).toBeInTheDocument();
  });
  it("displays menu items for navigation", () => {
    renderMainNav();
    const navigationMenuItems = screen.getAllByRole("listitem");
    const navigationMenuText = navigationMenuItems.map(
      (navigationMenuItem) => navigationMenuItem.textContent
    );
    expect(navigationMenuText).toEqual([
      "Teams",
      "Locations",
      "Benefits",
      "Jobs",
      "Students",
    ]);
  });

  describe("When the user logs in", () => {
    it("displays user profile picture", async () => {
      renderMainNav();
      const userStore = useUserStore();

      let profileImage = screen.queryByRole("img", {
        name: /User profile image/i,
      });
      expect(profileImage).not.toBeInTheDocument();

      const signInButton = screen.getByRole("button", {
        name: /sign in/i,
      });
      userStore.isLoggedIn = true; // simulate the user is logged in
      expect(signInButton.textContent?.trim().toLowerCase()).toBe("sign in");

      await userEvent.click(signInButton);
      profileImage = screen.getByRole("img", {
        name: /User profile image/i,
      });
      expect(profileImage).toBeInTheDocument();
    });
  });
});
