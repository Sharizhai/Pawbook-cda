import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import ProfileCard from "$components/profile/ProfileCard.svelte";
import {PublicUserInformations} from "../../../src/types/userTypes";

vi.mock("$stores/stores.svelte", () => ({
  user: {
    information: {
      id: "current-user-id"
    }
  },
  follow: {
    isFollowing: () => false
  },
  app: {
    activeLocale: "fr"
  }
}));

vi.mock("$services/followServices.svelte", () => ({
  createFollow: vi.fn()
}));

describe("ProfileCard Component", () => {
  const mockProfileUser: Partial<PublicUserInformations> = {
    id: "75158763-7a61-4187-a8d7-b92d1643d32b",
    firstName: "John",
    name: "Doe",
    profileDescription: "A passionate animal lover",
    profilePicture: ""
  };

  it("Should render the component with all elements", () => {
    const { container } = render(ProfileCard, {
      props: {
        profileUser: mockProfileUser,
        isSelfProfile: false
      }
    });

    expect(container.querySelector(".profile-card-container")).not.toBeNull();
    expect(container.querySelector(".profile-card-settings-button")).not.toBeNull();
    expect(container.querySelector(".profile-card-container-user-infos")).not.toBeNull();
    expect(container.querySelector(".profile-card-container-user-infos-avatar")).not.toBeNull();
    expect(container.querySelector(".profile-card-container-user-infos-container-name")).not.toBeNull();
    expect(container.querySelector(".profile-card-container-user-infos-buttons-container")).not.toBeNull();
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("Should display the correct user name", () => {
    const profileUser: Partial<PublicUserInformations> = {
      id: "user-123",
      firstName: "Jane",
      name: "Smith",
      profileDescription: "",
      profilePicture: ""
    };

    const { container } = render(ProfileCard, {
      props: {
        profileUser,
        isSelfProfile: false
      }
    });

    const nameElement = container.querySelector(".profile-card-container-user-infos-container-name");
    expect(nameElement).not.toBeNull();
    expect(nameElement?.textContent).toBe(`${profileUser.firstName} ${profileUser.name}`);
  });

  it("Should display the description when provided", () => {
    const profileUser: Partial<PublicUserInformations> = {
      id: "user-123",
      firstName: "John",
      name: "Doe",
      profileDescription: "A passionate animal lover",
      profilePicture: ""
    };

    const { container } = render(ProfileCard, {
      props: {
        profileUser,
        isSelfProfile: false
      }
    });

    const descriptionElement = container.querySelector(".profile-card-container-user-infos-container-description");
    expect(descriptionElement).not.toBeNull();
    expect(descriptionElement?.textContent).toBe(profileUser.profileDescription);
  });

  it("Should use default image when profilePicture is not provided", () => {
    const { container } = render(ProfileCard, {
      props: {
        profileUser: mockProfileUser,
        isSelfProfile: false
      }
    });

    const avatarElement = container.querySelector(".profile-card-container-user-infos-avatar") as HTMLImageElement;
    expect(avatarElement).not.toBeNull();
    expect(avatarElement.src).toContain("/paws.png");
  });

  it("Should use provided image when profilePicture is provided", () => {
    const profileUser: Partial<PublicUserInformations> = {
      id: "user-123",
      firstName: "John",
      name: "Doe",
      profileDescription: "",
      profilePicture: "/test-profile.jpg"
    };

    const { container } = render(ProfileCard, {
      props: {
        profileUser,
        isSelfProfile: false
      }
    });

    const avatarElement = container.querySelector(".profile-card-container-user-infos-avatar") as HTMLImageElement;
    expect(avatarElement).not.toBeNull();
    expect(avatarElement.src).toContain("/test-profile.jpg");
  });

  it("Should apply custom class when provided", () => {
    const customClass = "test-custom-class";
    const { container } = render(ProfileCard, {
      props: {
        profileUser: mockProfileUser,
        isSelfProfile: false,
        customClass
      }
    });

    const cardContainer = container.querySelector(".profile-card-container");
    expect(cardContainer).not.toBeNull();
    expect(cardContainer?.classList.contains(customClass)).toBe(true);
  });

  it("Should have a clickable follow button", async () => {
    const { container } = render(ProfileCard, {
      props: {
        profileUser: mockProfileUser,
        isSelfProfile: false
      }
    });

    const followButton = container.querySelector(".profile-card-container-user-infos-buttons-container button");
    expect(followButton).not.toBeNull();
    expect(followButton?.hasAttribute("disabled")).toBe(false);

    await fireEvent.click(followButton as HTMLElement);
  });

  it("Should have a clickable settings button", async () => {
    const { container } = render(ProfileCard, {
      props: {
        profileUser: mockProfileUser,
        isSelfProfile: false
      }
    });

    const settingsButton = container.querySelector(".profile-card-settings-button") as HTMLElement;
    expect(settingsButton).not.toBeNull();
    expect(settingsButton?.hasAttribute("disabled")).toBe(false);

    await fireEvent.click(settingsButton);
    });
});