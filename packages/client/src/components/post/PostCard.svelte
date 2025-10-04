<script lang="ts">
    import CommentInput from "./CommentInput.svelte";
    import SettingsButton from "$components/generic/SettingsButton.svelte";
    import LikeButton from "$components/post/LikeButton.svelte";
    import TopContainerInfos from "./TopContainerInfos.svelte";
    import type {PostInformations} from "$types/postTypes";
    import * as messages from "$lib/paraglide/messages";
    import PostContent from "./PostContent.svelte";

    import commentIcon from "$assets/icons/posts/comment.svg?raw";

    const commentLabel = messages.post_comment();

    let { post } : { post : PostInformations } = $props();

    let isCommentInputVisible = $state(false);

    const postPhotos = [
        "/paws.png",
        "/paws.png",
        "/paws.png",
        "/paws.png",
    ];

    function onSettingsButtonClick() {
        console.log("Settings button clicked!");
    }

    function onLikeButtonClick() {
        console.log("Like button clicked!");
    }

    function onCommentButtonClick() {
        isCommentInputVisible = !isCommentInputVisible;
    }

    function onSendCommentButtonClick(commentText: string) {
        console.log("Comment text:", commentText);
    }

</script>

    <div class="postcard-main-container">
        <SettingsButton onClick={onSettingsButtonClick} customClass="postcard-settings-button" />

        <TopContainerInfos profilePicture="/paws.png" firstName="User" lastName="Name" postCreationDate={new Date(post.createdAt)}/>
        <PostContent textContent={post.textContent} imageContent={postPhotos}/>

        <div class="postcard-buttons-container">
            <LikeButton onClick={onLikeButtonClick} likeCount={post.likes}/>

            <button class="postcard-button postcard-comment-button" onclick={onCommentButtonClick}>
                <span class="postcard-button-icon">{@html commentIcon}</span>
                {commentLabel}
            </button>
            <!-- TODO: Add comment count here if post.omment.length > 0 -->
        </div>

        <CommentInput bind:isVisible={isCommentInputVisible} onClick={onSendCommentButtonClick}/>
    </div>

<style lang="scss">
    .postcard-main-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: var(--main-background-color);
        border-radius: 1rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-bottom: 1rem;
        padding: 0.625rem;
    }

    :global(.postcard-settings-button) {
        position: absolute;
        top: 0.5rem;
        right: 0.2rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .postcard-buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 1rem;
        padding-top: 0.5rem;
        gap: 1rem;
        border-top: 1px solid rgba(30, 138, 182, 0.2);
    }
    
    .postcard-button {
        background-color: transparent;
        border: none;
        color: var(--main-text-color);
        font-size: 0.9rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        &:hover, &:hover :global(svg) {
            color: var(--second-highlight-color);
        }

        &-icon {
            width: 1.5rem;
            height: 1.5rem;
        }

        &-icon :global(svg) {
            width: 1.5rem;
            height: 1.5rem;
            color: var(--main-text-color);
        }
    }
</style>