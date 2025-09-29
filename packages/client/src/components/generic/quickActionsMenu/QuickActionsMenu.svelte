<script lang="ts">
    import type {QuickActionsMenuActionProperties} from "$types/quickActionsMenuTypes";
    import LanguageDropdown from "$components/LanguageDropdown.svelte";

    let {
        isVisible,
        top,
        left,
        right,
        actions,
        onClose,
        haslanguageDropdown = false
    } : {
        isVisible: boolean,
        top?: string,
        left?: string,
        right?: string,
        actions: QuickActionsMenuActionProperties[],
        onClose?: () => void,
        haslanguageDropdown?: boolean,
    } = $props();

    let menuElement: HTMLDivElement | undefined = $state();

    $effect(() => {
        if (!isVisible || !menuElement) return;
    })
</script>

{#if isVisible}
    <div class="quick-actions-menu" style:top={top} style:left={left} style:right={right} bind:this={menuElement}>
        {#if haslanguageDropdown}
            <LanguageDropdown />
        {/if}
        {#each actions as action}
            <button class="quick-actions-menu-button" class:warning-action={action.isWarningAction} onclick={action.onClick} disabled={action.disabled}>
                {@html action.icon}
                {action.label}
            </button>
        {/each}
    </div>
{/if}

<style lang="scss">
    .quick-actions-menu {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        position: absolute;
        padding: 0.5rem;
        background-color: rgba(30, 138, 182, 0.5);
        z-index: 102;
        border-radius: 0.6rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        &-button {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
            height: 2.5rem;
            font-size: 1rem;
            font-weight: 500;
            color: var(--main-text-color);
            background-color: var(--main-background-color);
            border: 1px solid rgba(30, 138, 182, 0.7);
            border-radius: 0.45rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);

            :global(svg){
                width: 1.5rem;
                height: 1.5rem;
            }

            &.warning-action {
                color: var(--main-background-color);
                background-color: var(--color-alert);
                border: 1px solid transparent;
            }
        }
    }
</style>