<script lang="ts">
    import SearchResult from "$components/search/SearchResult.svelte";
    import SearchInput from "$components/search/SearchInput.svelte";
    import {searchUserOrPet} from "$services/searchServices.svelte";
    import Scrollbar from "$components/generic/Scrollbar.svelte";
    import {ScrollbarOrientation} from "$types/scrollbarTypes";
    import * as messages from "$lib/paraglide/messages";
    import {isMobile} from "$utils/deviceUtils";
    import { fly } from "svelte/transition";
    import {push} from "svelte-spa-router";

    import closeIcon from "$assets/icons/close.svg?raw";
    import type {UserSearchResult} from "$types/userTypes";
    import type {AnimalSearchResult} from "$types/animalTypes";

    const title = messages.navbar_search();

    let { isVisible = $bindable() } : { isVisible: boolean } = $props();

    let searchTerm = $state("");
    let results = $state<{ users: UserSearchResult[], animals: AnimalSearchResult[] }>({ users: [], animals: [] });

    let debounceTimer: ReturnType<typeof setTimeout>;

    $effect(() => {
        clearTimeout(debounceTimer);
        if (searchTerm.trim().length < 2) {
            results = { users: [], animals: [] };
            return;
        }
        debounceTimer = setTimeout(async () => {
            results = await searchUserOrPet(searchTerm);
        }, 100);
    });

    $effect(() => {
        if(!isVisible) searchTerm = "";
    });

    function onCloseSearchPanelButtonClick() {
        isVisible = false;
    }

    function onSearchResultClick(entity: UserSearchResult | AnimalSearchResult) {
        switch(entity.kind) {
            case "user":
                push(`/profile/${entity.id}`);
                break;
            case "animal":
                push(`/profile/${entity.ownerId}`);
                break;
        }

        isVisible = false;
    }
</script>

{#if isVisible}
    <div class="search-panel" class:mobile={isMobile()} transition:fly={{duration:300, x:500}}>
        <button class="search-panel-close-button" onclick={onCloseSearchPanelButtonClick}>
            <span>{@html closeIcon}</span>
        </button>

        <h2 class="search-panel-title" class:mobile={isMobile()}>{title}</h2>

        <SearchInput bind:searchQuery={searchTerm}/>

        <div class="search-panel-results">
            <Scrollbar orientation={ScrollbarOrientation.Vertical}>
                <div class="search-panel-results-items" class:mobile={isMobile()}>
                    {#each [...results.users, ...results.animals] as result}
                        <SearchResult entity={result} onResultClick={() => onSearchResultClick(result)}/>
                    {/each}
                </div>
            </Scrollbar>
        </div>
    </div>
{/if}

<style lang="scss">
    .search-panel {
        --navbar-height: 60px;
        --bottom-nav-height: 0px;
        --title-height: 2.6rem;
        --panel-padding: 1rem;
        --search-input-height: 3rem;
        --search-input-margin: 3rem;
        --results-padding: 1rem;

        &.mobile {
            --navbar-height: 0px;
            --bottom-nav-height: 80px;
            --title-height: 4.5rem;
        }

        display: flex;
        flex-direction: column;
        background-color: var(--main-background-color);
        position: fixed;
        top: 60px;
        right: 0;
        bottom: 0;
        width: 35rem;
        padding: 1rem;
        z-index: 11;
        border-left: 1px solid var(--main-highlight-color);
        box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);

        &-close-button {
            position: absolute;
            top: 1.5rem;
            right: 1rem;
            background-color: transparent;
            border: none;
            color: var(--main-text-color);
            cursor: pointer;
        }

        &.mobile {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            padding: 1rem;
            border-left: none;
            box-shadow: none;
        }

        &-title {
            padding: 0;
            margin: 0.35rem 0;
            font-size: 1.9rem;
            font-weight: 500;
            color: var(--main-text-color);
            font-family: var(--title-font-family);
            text-align: center;

            &.mobile {
                padding: 0 0 1.5rem 0;
                margin: 0.5rem 0;
                font-size: 2rem;
                font-weight: 500;
                color: var(--main-text-color);
                font-family: var(--title-font-family);
                text-align: center;
                border-bottom: 1px solid rgba(30, 138, 182, 0.4);
            }
        }

        &-results {
            padding: 1rem 0.5rem;

            &-items {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                height: calc(
                        100vh
                        - var(--navbar-height)
                        - var(--bottom-nav-height)
                        - (var(--panel-padding) * 2)
                        - var(--title-height)
                        - var(--search-input-margin)
                        - var(--search-input-height)
                        - var(--results-padding)
                );
            }
        }

        :global(.search-input-container) {
            margin-top: 3rem;
        }
    }
</style>