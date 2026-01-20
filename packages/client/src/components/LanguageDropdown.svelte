<script lang="ts">
    import { languageOptions } from "$types/languageTypes";
    import { app } from "$stores/stores.svelte";

    let isLanguageDropdownExpanded = false;

    function toggleLanguageDropdown() {
        isLanguageDropdownExpanded = !isLanguageDropdownExpanded;
    }

    function onLanguageOptionButtonClick(option: string) {
        app.activeLocale = option;
        isLanguageDropdownExpanded = false;
    }
</script>
<div class="language-dropdown">

    <div class="language-dropdown-container">
        <div class="language-dropdown-container-choices" class:expanded={isLanguageDropdownExpanded}>
            <button onclick={toggleLanguageDropdown} class="language-dropdown-container-button" type="button">
                {languageOptions.find(option => option.key === app.activeLocale)?.value}
                <span class="language-dropdown-container-button-icon material-icons">keyboard_arrow_down</span>
            </button>
           
            {#if isLanguageDropdownExpanded}
                <div class="language-dropdown-container-options-list">
                    {#each languageOptions as option}
                        <button
                            onclick={() => onLanguageOptionButtonClick(option.key)}
                            class="language-dropdown-container-option"
                        >
                            {option.value}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>


<style lang="scss">
    .language-dropdown {
        width: 100%;

        &-container {
            width: 100%;

            &-choices {
                position: relative;
                width: 100%;
                margin: 0;
                padding: 0;

                &.expanded {
                    .language-dropdown-container-options-list {
                        display: block;
                        opacity: 1;
                        margin: 0.3rem 0 0 0;
                        border-radius: 0.3125rem;
                        z-index: 1;
                    }

                    .language-dropdown-container-button-icon {
                        transform: rotate(180deg);
                    }    
                }
            }

            &-button {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 2.5rem;
                border-radius: 0.3125rem;
                background-color: rgba(255, 255, 255, 0.5);
                font-size: 1rem;
                color: var(--main-text-color);
                padding: 0 0.9rem;
                border: 1px solid rgba(30, 138, 182, 0.7);
                cursor: pointer;

                &:hover {
                    color: var(--second-highlight-color);
                }

                &:focus {
                    border: 1px solid var(--second-highlight-color);
                }

            }
            
            &-options-list {
                position: absolute;
                width: 100%;
                transition: opacity 0.2s ease-in-out;
                border-radius: 0.3125rem;
                border: 1px solid var(--second-highlight-color);
            }

            &-option {
                font-size: 1rem;
                width: 100%;
                text-align: left;
                margin: 0;
                padding: 0.25rem 0.9375rem;
                border: none;
                background-color: white;
                color: var(--main-text-color);
                border-radius: 0.3125rem;
                cursor: pointer;

                &:hover {
                    color: var(--second-highlight-color);
                }
            }

            &-button-icon {
                justify-self: flex-end;
                margin-left: auto;
                margin: 0 0 0 0.5rem;
            }
        }
    }
</style>