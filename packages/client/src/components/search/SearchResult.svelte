<script lang="ts">
    import type {AnimalSearchResult} from "$types/animalTypes";
    import type {UserSearchResult} from "$types/userTypes";

    import pawIcon from "$assets/icons/cat-face.svg?raw";

    let { entity, onResultClick } : { entity: AnimalSearchResult | UserSearchResult, onResultClick: () => void } = $props();

</script>

<button class="search-result" onclick={onResultClick}>
    {#if entity.kind === "user"}
        <div class="search-result-picture-container">
            <img src={entity.profilePicture ? entity.profilePicture : "/paws.png"} alt="User Avatar" class="search-result-picture" />
        </div>
        <span class="search-result-name">{entity.firstName} {entity.name}</span>
    {:else}
        <div class="search-result-picture-container">
            <img src={entity.picture ? entity.picture : "/paws.png"} alt="Animal" class="profile-card-container-user-infos-avatar" />
        </div>
        <div style="display: flex; flex-direction: column; justify-content: start; align-items: flex-start;">
            <span class="search-result-name">
                {entity.name}
                <span class="search-result-icon">{@html pawIcon}</span>
            </span>
            <span class="search-result-animal-type">{entity.type}</span>
        </div>
    {/if}
</button>

<style lang="scss">
    .search-result {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: 0.5rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        border-radius: 0.6rem;
        background-color: var(--main-background-color);
        color: var(--main-text-color);

        &:hover {
            background-color: var(--light-blue);
        }

        &-picture-container {
            flex-shrink: 0;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            margin-right: 0.5rem;
            border: 1px solid rgba(30, 138, 182, 0.4);
            overflow: hidden;
        }

        &-picture {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &-name {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            font-size: 0.9rem;
            font-weight: bold;
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

        &-animal-type {
            font-size: 0.8rem;
            color: var(--second-text-color);
        }
    }

</style>