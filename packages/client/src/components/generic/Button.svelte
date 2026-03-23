<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    import type {ButtonType} from "$types/buttonTypes";

    let {
        onClick,
        label,
        customClass,
        customStyle,
        isDisabled = false,
        isCTA = false,
        hadShadow,
        type = "button"
    } : {
        onClick?: MouseEventHandler<HTMLButtonElement>,
        label: string,
        customClass?: string,
        customStyle?: string,
        isDisabled?: boolean,
        isCTA?: boolean,
        hadShadow?: boolean,
        type?: ButtonType
    } = $props();
</script>

<button class="button-default {customClass ?? ''}"
        onclick={onClick}
        style={customStyle}
        disabled={isDisabled}
        class:main-cta={isCTA}
        class:shadow-box={hadShadow}
        type={type}
> {label} </button>

<style lang="scss">
    .button-default {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 10.625rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(30, 138, 182, 0.5);
        background-color: rgba(255, 255, 255, 0.5);
        color: var(--main-text-color);
        font-size: 1rem;
        font-weight: bold;
        padding: 0.625rem 1.25rem;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        box-sizing: border-box;

        &:hover {
            color: var(--second-highlight-color);
            border: 1px solid var(--second-highlight-color);
        }

        &:disabled {
            background-color: color-mix((in srgb, rgba(255, 255, 255, 0.5) 80%, black));
            border: 1px solid var(--second-text-color);
            cursor: default;
        }
    }

    .main-cta {
        background-color: rgba(30, 138, 182, 0.5);
        border: 1px solid rgba(30, 138, 182, 0.5);
        color: var(--main-text-color);

        &:hover {
            color: var(--main-text-color);
            border: 1px solid var(--main-text-color);
        }
    }

    .shadow-box {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    }

    //.shadow-box {
    //    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    //    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    //    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    //
    //    &:hover {
    //        animation: bounceUp 0.6s ease forwards;
    //        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
    //    }
    //}
    //
    //@keyframes bounceUp {
    //    0% {
    //        transform: translateY(0);
    //    }
    //    40% {
    //        transform: translateY(-8px);
    //    }
    //    60% {
    //        transform: translateY(-4px);
    //    }
    //    80% {
    //        transform: translateY(-6px);
    //    }
    //    100% {
    //        transform: translateY(-6px);
    //    }
    //}
</style>