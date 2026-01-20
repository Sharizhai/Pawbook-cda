<script lang="ts">
    import type {OpinionType} from "$types/opinionTypes";
    import starIcon from "$assets/icons/star-full.svg?raw";

    let { opinion }: { opinion: OpinionType } = $props();

</script>

<div class="opinion-card">
    <h3 class="opinion-card-title">
        {opinion.title}
    </h3>

    <div class="opinion-card-stars">
        <span>{@html starIcon}</span>
        <span>{@html starIcon}</span>
        <span>{@html starIcon}</span>
        <span>{@html starIcon}</span>
        <span>{@html starIcon}</span>
    </div>

    <p class="opinion-card-description">
        {opinion.description}
    </p>
</div>

<style lang="scss">
    .opinion-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--main-highlight-color);
        border-radius: 0.75rem;
        margin: 2rem 0 0 0;
        padding : 1.5rem 1rem 1rem 1rem;
        width: 100%;
        max-width: 35rem;
        backdrop-filter: blur(3px);
        gap: 0.5rem;

        &:first-child {
            margin-top: 0;
        }

        &-title {
            font-family: var(--second-font-family);
            margin-bottom: 0;
        }

        :global(svg) {
            color: var(--color-edit);
            width: 1.5rem;
            height: 1.5rem;
        }

        &-description {
            margin-bottom: 0;
        }
    }
</style>