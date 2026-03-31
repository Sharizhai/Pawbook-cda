<script lang="ts">
    import QuickActionsMenu from "$components/generic/quickActionsMenu/QuickActionsMenu.svelte";
    import type {QuickActionsMenuActionProperties} from "$types/quickActionsMenuTypes";
    import ReportDialogPanel from "$components/dialogPanels/ReportDialogPanel.svelte";
    import SettingsButton from "$components/generic/SettingsButton.svelte";
    import {createPostReport} from "$services/postReportsServices.svelte";
    import {createLike, deleteLike} from "$services/likeServices";
    import LikeButton from "$components/post/LikeButton.svelte";
    import TopContainerInfos from "./TopContainerInfos.svelte";
    import {PostReportReason} from "$types/postReportTypes";
    import type {PostInformations} from "$types/postTypes";
    import {user, like, post} from "$stores/stores.svelte";
    import * as messages from "$lib/paraglide/messages";
    import CommentInput from "./CommentInput.svelte";
    import PostContent from "./PostContent.svelte";
    import {push} from "svelte-spa-router";
    import {onMount} from "svelte";

    import commentIcon from "$assets/icons/posts/comment.svg?raw";
    import reportIcon from "$assets/icons//posts/report.svg?raw";
    import deleteIcon from "$assets/icons/delete.svg?raw";
    import editIcon from "$assets/icons/edit.svg?raw";

    const commentLabel = messages.post_comment();
    const updatePostLabel = messages.post_card_settings_update();
    const deletePostLabel = messages.post_card_settings_delete();
    const reportPostLabel = messages.post_card_settings_report();

    let { postData } : { postData : PostInformations } = $props();

    const author = $derived(typeof postData.authorId === 'object' ? postData.authorId : null);
    const isOwnPost = $derived(
        typeof postData.authorId === 'object'
            ? postData.authorId.id === user.information.id
            : postData.authorId === user.information.id
    );

    let isCommentInputVisible = $state(false);
    let isQuickActionsMenuVisible = $state(false);
    let isReportDialogPanelVisible = $state(false);

    let settingsButtonElement: HTMLElement | undefined = $state();

    let selfSettingsQuickActionsMenuActionProperties: QuickActionsMenuActionProperties[] = $derived([
        {
            icon: editIcon,
            label: updatePostLabel,
            onClick: onQuickActionUpdatePostButtonClick
        },
        {
            icon: deleteIcon,
            label: deletePostLabel,
            onClick: onQuickActionDeletePostButtonClick,
            isWarningAction: true
        }
    ])

    let otherSettingsQuickActionsMenuActionProperties: QuickActionsMenuActionProperties[] = $derived([
        {
            icon: reportIcon,
            label: reportPostLabel,
            onClick: onQuickActionReportPostButtonClick,
            isWarningAction: true
        }
    ])

    let quickActionsMenuToDisplay: QuickActionsMenuActionProperties[] = $derived(isOwnPost ? selfSettingsQuickActionsMenuActionProperties : otherSettingsQuickActionsMenuActionProperties);

    onMount(async () => {
        // like.setLikes(likes);
    });

    function onSettingsButtonClick(event: MouseEvent) {
        settingsButtonElement = event.currentTarget as HTMLElement;
        isQuickActionsMenuVisible = !isQuickActionsMenuVisible;
    }

    async function onLikeButtonClick(postId: string) {
        try {
            if (like.isLikingPost(postId)) {
                await deleteLike(postId);
                post.updatePost(postId, { likeCount: (post.posts.find(p => p.id === postId)?.likeCount ?? 1) - 1 });
            } else {
                await createLike(postId);
                post.updatePost(postId, { likeCount: (post.posts.find(p => p.id === postId)?.likeCount ?? 0) + 1 });
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }

    function onCommentButtonClick() {
        isCommentInputVisible = !isCommentInputVisible;
    }

    function onSendCommentButtonClick(commentText: string) {
        console.log("Comment text:", commentText);
    }

    function onTopContainerNameButtonClick() {
        push(`/profile/${author?.id}`);
    }

    function onQuickActionUpdatePostButtonClick() {

    }

    function onQuickActionDeletePostButtonClick() {

    }

    function onQuickActionReportPostButtonClick() {
        isQuickActionsMenuVisible = false;
        isReportDialogPanelVisible = true;
    }

    async function onSubmitReportDialogPanelButtonClick(reason: PostReportReason, description?: string) {
        try {
            await createPostReport(postData.id, user.information.id, reason, description);
            isReportDialogPanelVisible = false;
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    }
</script>

    <div class="postcard-main-container">
        <SettingsButton onClick={onSettingsButtonClick} customClass="postcard-settings-button" />

        <TopContainerInfos profilePicture={author?.profilePicture || "/paws.png"}
                           firstName={author?.firstName} lastName={author?.name}
                           postCreationDate={new Date(postData.createdAt)} onNameClick={onTopContainerNameButtonClick}/>
        <PostContent textContent={postData.textContent} imageContent={postData.photoContent}/>

        <div class="postcard-buttons-container">
            <LikeButton onClick={() => onLikeButtonClick(postData.id)} isLikedBeMe={like.isLikingPost(postData.id)} likeCount={postData.likeCount}/>

            <button class="postcard-button postcard-comment-button" onclick={onCommentButtonClick}>
                <span class="postcard-button-icon">{@html commentIcon}</span>
                {commentLabel}
            </button>
            <!-- TODO: Add comment count here if post.omment.length > 0 -->
        </div>

        <CommentInput bind:isVisible={isCommentInputVisible} onClick={onSendCommentButtonClick}/>
        <QuickActionsMenu bind:isVisible={isQuickActionsMenuVisible} actions={quickActionsMenuToDisplay} anchorElement={settingsButtonElement} />
    </div>

<ReportDialogPanel bind:isVisible={isReportDialogPanelVisible} onReportClick={onSubmitReportDialogPanelButtonClick}/>

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
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 1rem;
        padding-top: 0.5rem;
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