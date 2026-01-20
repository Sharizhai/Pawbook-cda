<script lang="ts">
    import type {FeatureType} from "$types/featureTypes";

    let { feature } : { feature: FeatureType } = $props();
</script>

<div class="feature-card">
    <h3 class="feature-card-title">
        <span class="feature-card-icon">{@html feature.icon}</span>
        {feature.title}
    </h3>
    <p class="feature-card-description">{feature.description}</p>
</div>

<style lang="scss">
    .feature-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--main-highlight-color);
        border-radius: 0.75rem;
        margin: 2rem 0 0 0;
        padding : 1.5rem 1rem;
        width: 100%;
        max-width: 35rem;
        backdrop-filter: blur(3px);
        gap: 1rem;

        &:first-child {
            margin-top: 0;
        }

        &-title {
            font-family: var(--second-font-family);
            display: flex;
            width: 100%;
            align-items: center;
            text-align: left;
            gap: 0.5rem;
            margin : 0;
            padding: 0;

            :global(svg) {
                color: var(--second-highlight-color);
                width: 1.8rem;
                height: 1.8rem;
            }
        }

        &-description {
            margin: 0;
            padding: 0;
            font-size: 1.1rem;
        }
    }
</style>