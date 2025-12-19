import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import PostCard from "$components/post/PostCard.svelte";

const originalConsoleLog = console.log;

const mockPost = {
    _id: "1",
    authorId: {
        _id: "42",
        firstName: "John",
        name: "Doe",
        profilePicture: "/john.png"
    },
    createdAt: new Date().toISOString(),
    textContent: "Ceci est un post de test",
    photoContent: ["/photo1.jpg"],
    likes: [],
    comments: []
};

function renderPostCard() {
    return render(PostCard, { post: mockPost });
}

describe("PostCard Component", () => {
  beforeEach(() => {
    console.log = vi.fn();
  });
  
  afterEach(() => {
    console.log = originalConsoleLog;
    vi.clearAllMocks();
  });

  it("Should render the component with all components", () => {
    const { container } = renderPostCard();
    
    expect(container.querySelector(".postcard-main-container")).not.toBeNull();
    expect(container.querySelector(".postcard-settings-button")).not.toBeNull();
    expect(container.querySelector(".postcard-user-infos-container")).not.toBeNull();
    expect(container.querySelector(".postcard-content")).not.toBeNull();
    expect(container.querySelector(".postcard-buttons-container")).not.toBeNull();
  });

  it("Should display iuser infos", () => {
    const { container } = renderPostCard();
    
    const userAvatar = container.querySelector(".postcard-user-avatar") as HTMLImageElement;
    expect(userAvatar).not.toBeNull();
    expect(userAvatar.hasAttribute("src")).toBe(true);
    
    const userName = container.querySelector(".postcard-user-name");
    expect(userName).not.toBeNull();
    
    const postDate = container.querySelector(".postcard-user-post-date");
    expect(postDate).not.toBeNull();
  });

  it("Should render correctly post content", () => {
    const { container } = renderPostCard();
    
    const hasTextContent = container.querySelector(".postcard-content-text-content") !== null;
    const hasImageContent = container.querySelector(".post-images-grid") !== null;
    
    expect(hasTextContent || hasImageContent).toBe(true);
  });

  it("devrait appeler onSettingsButtonClick lors du clic sur le bouton de paramètres", async () => {
    const { container } = renderPostCard();

    const settingsButton = container.querySelector(".postcard-settings-button") as HTMLElement;
    let quickActionsMenu = container.querySelector(".quick-actions-menu");
    expect(quickActionsMenu).toBeFalsy();

    await fireEvent.click(settingsButton);
    quickActionsMenu = container.querySelector(".quick-actions-menu");
    expect(quickActionsMenu).toBeTruthy();

    await fireEvent.click(settingsButton);
  });

  it("Should toggle like correctly and call onLikeButtonClick", async () => {
    const { container } = renderPostCard();
    
    const initialLikeButton = container.querySelector(".like-button-icon") as HTMLElement;
    const initialIsLiked = initialLikeButton.classList.contains("liked");
    
    await fireEvent.click(container.querySelector(".like-button") as HTMLElement);
    
    const updatedLikeButton = container.querySelector(".like-button-icon") as HTMLElement;
    expect(updatedLikeButton.classList.contains("liked")).toBe(!initialIsLiked);
    expect(console.log).toHaveBeenCalledWith("Like button clicked!");
  });

  it("Should toggle CommentInput visibility", async () => {
    const { container } = renderPostCard();
    
    const initialCommentInputVisible = container.querySelector(".comment-input-container") !== null;
    
    await fireEvent.click(container.querySelector(".postcard-comment-button") as HTMLElement);
    
    const updatedCommentInputVisible = container.querySelector(".comment-input-container") !== null;
    expect(updatedCommentInputVisible).toBe(!initialCommentInputVisible);
    
    await fireEvent.click(container.querySelector(".postcard-comment-button") as HTMLElement);
    
    const finalCommentInputVisible = container.querySelector(".comment-input-container") !== null;
    expect(finalCommentInputVisible).toBe(initialCommentInputVisible);
  });

  it("Should send the right comment", async () => {
    const { container } = renderPostCard();
    
    if (!container.querySelector(".comment-input-container")) {
      await fireEvent.click(container.querySelector(".postcard-comment-button") as HTMLElement);
    }
    
    const input = container.querySelector(".comment-input") as HTMLInputElement;
    expect(input).not.toBeNull();
    
    const testComment = "Ceci est un commentaire de test";
    await fireEvent.input(input, { target: { value: testComment } });
    
    await fireEvent.click(container.querySelector(".comment-input-container-button") as HTMLElement);
    
    expect(console.log).toHaveBeenCalledWith("Comment text:", testComment);
  });

  it("Should work if comment text is empty", async () => {
    const { container } = renderPostCard();
    
    if (!container.querySelector(".comment-input-container")) {
      await fireEvent.click(container.querySelector(".postcard-comment-button") as HTMLElement);
    }
    
    const input = container.querySelector(".comment-input") as HTMLInputElement;
    await fireEvent.input(input, { target: { value: " " } });
    
    await fireEvent.click(container.querySelector(".comment-input-container-button") as HTMLElement);
    
    expect(console.log).not.toHaveBeenCalledWith("Comment text:", expect.anything());
  });

  it("Should call onImageClick when image is clicked", async () => {
    const { container } = renderPostCard();
    
    const images = container.querySelectorAll(".post-image-content");
    
    if (images.length > 0) {
      await fireEvent.click(images[0] as HTMLElement);
      
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Image \d+ cliquée/));
    }
  });
});