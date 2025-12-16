import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import AnimalCard from "$components/profile/AnimalCard.svelte";
import {AnimalInformations} from "../../../src/types/animalTypes";

describe("AnimalCard Component", () => {

  it("Should render the component with all elements", () => {
    const animal: AnimalInformations = {
      name: "Rex",
      type: "Chien",
      likes: ["1", "2", "3", "4", "5"]
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    expect(container.querySelector(".animal-card-container")).not.toBeNull();
    expect(container.querySelector(".animal-card-settings-button")).not.toBeNull();
    expect(container.querySelector(".animal-card-container-infos")).not.toBeNull();
    expect(container.querySelector(".animal-card-container-infos-avatar")).not.toBeNull();
    expect(container.querySelector(".animal-card-container-infos-container-name")).not.toBeNull();
    expect(container.querySelector(".animal-card-container-infos-container-infos")).not.toBeNull();
    expect(container.querySelector(".animal-card-container-like-button-container")).not.toBeNull();
  });

  it("Should display the correct animal name", () => {
    const animal: AnimalInformations = {
      name: "Fluffy",
      type: "Chat",
      likes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const nameElement = container.querySelector(".animal-card-container-infos-container-name");
    expect(nameElement).not.toBeNull();
    expect(nameElement?.textContent).toBe(animal.name);
  });

  it("Should display the correct animal info with all properties", () => {
    const animal: AnimalInformations = {
      name: "Max",
      type: "Chien",
      race: "Labrador",
      age: 3,
      likes: ["1", "2", "3", "4", "5"]
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const infoElement = container.querySelector(".animal-card-container-infos-container-infos");
    expect(infoElement).not.toBeNull();
    expect(infoElement?.textContent).toBe("Chien, Labrador, 3 ans");
  });

  it("Should display the correct animal info with partial properties", () => {
    const animal: AnimalInformations = {
      name: "Kitty",
      type: "Chat",
      likes: Array(8).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const infoElement = container.querySelector(".animal-card-container-infos-container-infos");
    expect(infoElement).not.toBeNull();
    expect(infoElement?.textContent).toBe("Chat");
  });

  it("Should display the animal description when provided", () => {
    const description = "A very friendly animal";
    const animal: AnimalInformations = {
      name: "Buddy",
      type: "Chien",
      description: description,
      likes: Array(20).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const descriptionElement = container.querySelector(".animal-card-container-infos-container-description");
    expect(descriptionElement).not.toBeNull();
    expect(descriptionElement?.textContent).toBe(description);
  });

  it("Should use default image when animalPicture is not provided", () => {
    const animal: AnimalInformations = {
      name: "Rex",
      type: "Chien",
      likes: Array(5).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const avatarElement = container.querySelector(".animal-card-container-infos-avatar") as HTMLImageElement;
    expect(avatarElement).not.toBeNull();
    expect(avatarElement.src).toContain("/paws.png");
  });

  it("Should use provided image when animalPicture is provided", () => {
    const imagePath = "/test-image.jpg";
    const animal: AnimalInformations = {
      name: "Rex",
      type: "Chien",
      picture: imagePath,
      likes: Array(5).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const avatarElement = container.querySelector(".animal-card-container-infos-avatar") as HTMLImageElement;
    expect(avatarElement).not.toBeNull();
    expect(avatarElement.src).toContain(imagePath);
  });

  it("Should call onSettingsButtonClick when settings button is clicked", async () => {
    // Save original console.log
    const originalConsoleLog = console.log;

    // Create a variable to track if the function was called with the right message
    let settingsButtonClicked = false;

    // Override console.log to check for the expected message
    console.log = (message: string) => {
      if (message === "Settings button clicked!") {
        settingsButtonClicked = true;
      }
    };

    const animal: AnimalInformations = {
      name: "Rex",
      type: "Chien",
      likes: Array(5).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const settingsButton = container.querySelector(".animal-card-settings-button") as HTMLElement;
    expect(settingsButton).not.toBeNull();

    await fireEvent.click(settingsButton);

    // Restore original console.log
    console.log = originalConsoleLog;

    // Check if the function was called with the right message
    expect(settingsButtonClicked).toBe(true);
  });

  it("Should call onLikeButtonClick when like button is clicked", async () => {
    // Save original console.log
    const originalConsoleLog = console.log;

    // Create a variable to track if the function was called with the right message
    let likeButtonClicked = false;

    // Override console.log to check for the expected message
    console.log = (message: string) => {
      if (message === "Like button clicked!") {
        likeButtonClicked = true;
      }
    };

    const animal: AnimalInformations = {
      name: "Rex",
      type: "Chien",
      likes: Array(5).fill(0)
    };

    const { container } = render(AnimalCard, {
      props: { animal }
    });

    const likeButton = container.querySelector(".like-button") as HTMLElement;
    expect(likeButton).not.toBeNull();

    await fireEvent.click(likeButton);

    // Restore original console.log
    console.log = originalConsoleLog;

    // Check if the function was called with the right message
    expect(likeButtonClicked).toBe(true);
  });
});
