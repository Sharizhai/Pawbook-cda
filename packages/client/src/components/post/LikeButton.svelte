<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

    import filledLikeIcon from "$assets/icons/posts/like-fill.svg?raw";
    import likeIcon from "$assets/icons/posts/like.svg?raw";

    let { onClick, likeCount } : { onClick: MouseEventHandler<HTMLButtonElement>, likeCount?: string[] } = $props();
    let isLikedBeMe = $state(false);

    function onLikeButtonClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
        event.stopPropagation();
        isLikedBeMe = !isLikedBeMe;
        onClick && onClick(event);
    }

</script>

    <div class="like-button-container">
        <button class="like-button" onclick={onLikeButtonClick}>
            <span class="like-button-icon {isLikedBeMe ? 'liked' : ''}">{@html isLikedBeMe ? filledLikeIcon : likeIcon}</span>
            {#if likeCount}
                <span class="like-button-count">{likeCount}</span>
            {/if}
        </button>
    </div>

<style lang="scss">
    .like-button-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }
    
    .like-button {
        background-color: transparent;
        border: none;
        color: var(--main-text-color);
        font-size: 0.9rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.2rem;
        cursor: pointer;

        &:hover, &:hover :global(svg) {
            color: var(--second-highlight-color);
        }

        &-icon{
            width: 1.5rem;
            height: 1.5rem;
        }

        &-icon :global(svg) {
            width: 1.5rem;
            height: 1.5rem;
            color: var(--main-text-color);
        }

        &-count {
            font-size: 0.8rem;
            font-weight: bold;
            color: var(--color-like);
        }
    }

    .like-button-icon.liked :global(svg){
        color: var(--color-like);
    }
</style>