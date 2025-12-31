<script lang="ts">
    import type {DropdownOptions} from "$types/dropdownTypes";

    let {
        title,
        options,
        onOptionSelected = (option: string) => {},
        value = $bindable(),
    } : {
        title?: string,
        options: DropdownOptions[],
        onOptionSelected?: (option: string) => void,
        value?: string,
    } = $props();

    let isDropdownExpanded: boolean = $state(false);
    let selectedOption = $derived(options.find((option) => option.value === value));

    function toggleDropdown() {
        isDropdownExpanded = !isDropdownExpanded;
    }

    function onOptionButtonClick(optionValue: string) {
        value = optionValue;
        isDropdownExpanded = false;

        if (onOptionSelected) onOptionSelected(optionValue);
    }
</script>
<div class="dropdown">
    {#if title}
        <h3 class="dropdown-title">{title}</h3>
    {/if}
    <div class="dropdown-choices" class:expanded={isDropdownExpanded}>
        <button onclick={toggleDropdown} class="dropdown-button" type="button">
            {#if selectedOption}
                {#if selectedOption.icon}
                    <span class="dropdown-button-icon material-icons">{selectedOption.icon}</span>
                {/if}
                {selectedOption.label}
            {/if}
            <span class="dropdown-button-icon material-icons">keyboard_arrow_down</span>
        </button>

        {#if isDropdownExpanded}
            <div class="dropdown-options-list">
                {#each options as {value, icon, label}}
                    <button class="dropdown-option" onclick={() => onOptionButtonClick(value)}>
                        {#if icon}
                            <span class="dropdown-option-icon material-icons">{icon}</span>
                        {/if}
                        {label}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>


<style lang="scss">
    .dropdown {
        width: 100%;

        &-title {
            font-size: 1rem;
            color: var(--main-text-color);
            font-weight: bold;
            padding: 0;
            margin: 0 0 0.2rem 0;
        }

        &-choices {
            position: relative;
            width: 100%;
            margin: 0;
            padding: 0;

            &.expanded {
                .dropdown-options-list {
                    display: block;
                    opacity: 1;
                    margin: 0.3rem 0 0 0;
                    border-radius: 0.3125rem;
                    z-index: 1;
                }

                .dropdown-button-icon {
                        transform: rotate(180deg);
                }
            }
        }

        &-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 2.125rem;
            border-radius: 0.3125rem;
            background-color: var(--main-background-color);
            font-size: 1rem;
            color: var(--main-text-color);
            padding: 0 0.9rem;
            border: 1px solid rgba(30, 138, 182, 0.4);
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
            background-color: var(--main-background-color);
            color: var(--main-text-color);
            border-radius: 0.3125rem;
            cursor: pointer;

            &:hover {
                color: var(--second-highlight-color);
            }
        }

        &-button-icon {
            justify-self: flex-end;
            margin: 0 0 0 0.5rem;
            margin-left: auto;
        }
    }
</style>