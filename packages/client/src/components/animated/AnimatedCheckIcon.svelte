<script lang="ts">
    import { onMount } from "svelte";

    let {
        size = "4.5rem",
        color = "var(--second-highlight-color)"
    } : {
        size?: string,
        color?: string
    } = $props();

    const CIRCLE_LENGTH = 62.83;

    let checkmarkElement: SVGPathElement;
    let checkLength = $state(0);

    onMount(() => {
        checkLength = checkmarkElement.getTotalLength();
    });
</script>

<span class="animated-check-icon" style="--size: {size}; --color: {color};">
    <svg class="svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" style="--circle-length: {CIRCLE_LENGTH}"
        />
        <path bind:this={checkmarkElement} class="checkmark" d="M6.2 12.9L9.6429 16.5L11.6071 14.25M17.5 7.5L13.5714 12" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="--check-length: {checkLength}"
        />
    </svg>
</span>

<style lang="scss">
    .animated-check-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        height: var(--size);
        color: var(--color);
    }

    .svg {
        width: 100%;
        height: 100%;
        transform-origin: center;
        animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .circle {
        stroke-dasharray: var(--circle-length);
        stroke-dashoffset: var(--circle-length);
        animation: draw 0.5s ease-out 0.3s forwards;
    }

    .checkmark {
        stroke-dasharray: var(--check-length);
        stroke-dashoffset: var(--check-length);
        animation: draw 0.4s ease-out 0.75s forwards;
    }

    @keyframes pop-in {
        0%   { transform: scale(0); }
        70%  { transform: scale(1.15); }
        85%  { transform: scale(0.95); }
        100% { transform: scale(1); }
    }

    @keyframes draw {
        to { stroke-dashoffset: 0; }
    }
</style>