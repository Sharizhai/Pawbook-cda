<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

    let { label, icon, onClick } : { label: string, icon: string, onClick: MouseEventHandler<HTMLButtonElement> } = $props();
</script>

<div class="navbar-button-container">
    <button class="navbar-button" onclick={onClick}>
        <span class="icon-button">{@html icon}</span>
        {label}
    </button>
</div>

<style lang="scss">
    .navbar-button-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navbar-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        color: var(--main-text-color);
        font-size: 0.8rem;
        padding: 0.4rem;
        font-weight: bold;
        cursor: pointer;
        width: 4.375rem;

        &:hover, &:hover :global(svg) {
            color: var(--second-highlight-color);
        }
    } 

    .icon-button :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.1rem;
        color: var(--main-text-color);
    }
</style>