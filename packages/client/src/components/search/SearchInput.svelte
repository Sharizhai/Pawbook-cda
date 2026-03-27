<script lang="ts">
    import searchIcon from "$assets/icons/navbar/search.svg?raw";

    let { searchQuery = $bindable() } : { searchQuery: string } = $props();

</script>

<div class="search-input-container">
    <input class="search-input" type="text" bind:value={searchQuery} />
    <span class="search-input-icon">{@html searchIcon}</span>
</div>

<style lang="scss">
    .search-input-container {
        background-color: transparent;
        border: none;
        color: var(--main-text-color);
        width: 100%;
        font-size: 0.9rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.5rem 0 0 0;
        gap: 0.5rem;
        cursor: pointer;

        &:hover, &:hover :global(svg) {
            color: var(--second-highlight-color);
        }
    }

    .search-input {
        background-color: var(--main-background-color);
        border: 1px solid rgba(30, 138, 182, 0.4);
        border-radius: 5rem;
        padding: 0.5rem 0.5rem 0.5rem 3rem;
        height: 3rem;
        width: 100%;
        font-size: 1rem;
        color: var(--main-text-color);
        outline: none;

        &-icon {
            position: absolute;
            left: 2rem;
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