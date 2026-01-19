<script lang="ts">
    import type {MouseEventHandler} from "svelte/elements";

    let {
        onValidateClick,
        onDeleteClick
    } : {
        onValidateClick?: MouseEventHandler<HTMLButtonElement>,
        onDeleteClick?: MouseEventHandler<HTMLButtonElement>
    } = $props();

</script>

<div class="table-actions-buttons">
    {#if onValidateClick}
        <button class="table-actions-buttons validate-button" onclick={onValidateClick}>
            <span class="material-icons">check</span>
        </button>
    {/if}

    {#if onDeleteClick}
        <button class="table-actions-buttons delete-button" onclick={onDeleteClick}>
            <span class="material-icons">delete</span>
        </button>
    {/if}
</div>

<style lang="scss">
    .table-actions-buttons {
        display: flex;
        flex-direction: row;
        gap: 0.2rem;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        font-size: 1rem;

        &.validate-button {
            cursor: pointer;
            color: #008000;
        }

        &.delete-button {
            cursor: pointer;
            color: var(--color-alert);
        }
    }
</style>