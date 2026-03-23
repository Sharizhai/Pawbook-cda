<script lang="ts">
    import {QuickActionMenuPosition, type QuickActionsMenuActionProperties} from "$types/quickActionsMenuTypes";
    import LanguageDropdown from "$components/LanguageDropdown.svelte";

    let {
        isVisible = $bindable(),
        actions,
        anchorElement,
        placement = QuickActionMenuPosition.BOTTOMLEFT,
        onClose,
        haslanguageDropdown = false
    } : {
        isVisible: boolean,
        anchorElement?: HTMLElement,
        placement?: QuickActionMenuPosition,
        actions: QuickActionsMenuActionProperties[],
        onClose?: () => void,
        haslanguageDropdown?: boolean,
    } = $props();

    let menuElement: HTMLDivElement | undefined = $state();
    let position = $state({ top: "0px", left: "0px" });

    export function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() { node.remove(); }
        };
    }

    $effect(() => {
        if (!isVisible || !anchorElement || !menuElement) return;

        const rect = anchorElement.getBoundingClientRect();

        menuElement.style.visibility = "hidden";
        menuElement.style.top = "0px";
        menuElement.style.left = "0px";

        requestAnimationFrame(() => {
            if (!menuElement || !anchorElement) return;

            const menuRect = menuElement.getBoundingClientRect();
            const top = rect.bottom + 4;
            let left: number;

            switch (placement) {
                case "bottom-left":   left = rect.left; break;
                case "bottom-center": left = rect.left + (rect.width / 2) - (menuRect.width / 2); break;
                case "bottom-right":
                default:              left = rect.right - menuRect.width; break;
            }

            if (left < 8) left = 8;
            if (left + menuRect.width > window.innerWidth - 8) {
                left = window.innerWidth - menuRect.width - 8;
            }

            menuElement.style.top = `${top}px`;
            menuElement.style.left = `${left}px`;
            menuElement.style.visibility = "visible";
        });
    });
</script>

{#if isVisible}
    <div use:portal class="quick-actions-menu" style:top={position.top} style:left={position.left} bind:this={menuElement}>
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
        position: fixed;
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
            cursor: pointer;

            &:hover {
                background-color: var(--light-blue);
            }

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