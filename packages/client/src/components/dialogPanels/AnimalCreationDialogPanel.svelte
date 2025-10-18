<script lang="ts">
    import DialogPanelButton from "$components/generic/dialogPanel/DialogPanelButton.svelte";
    import DialogPanelInput from "$components/generic/dialogPanel/DialogPanelInput.svelte";
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import Dropdown from "$components/generic/Dropdown.svelte";
    import {isStringNotValid} from "$utils/stringUtils";
    import * as messages from "$lib/paraglide/messages";
    import type {Snippet} from "svelte";

    const panelTitle = messages.animal_creation_dialog_panel_title();
    const addButtonLabel = messages.animal_creation_dialog_panel_add();

    let selectedAnimalType: string = "";
    let selectedAnimalRace: string = "";

    let { isVisible = $bindable() } : { isVisible: boolean } = $props();

    const panelContent: Snippet[] = [contentSnippet];

    function onAddAnimalButtonClick() {
        // TODO:
        // Add logic
    }

</script>

{#snippet contentSnippet()}
    <DialogPanelInput type={"text"} name={"name"} label="Nom" />
    <div class="animal-creation-dialog-panel-inputs-wrapper">
        <DialogPanelInput type={"number"} name={"age"} label="Age" />
        <DialogPanelInput type={"text"} name={"sexe"} label="Sexe" />
    </div>
    <div class="animal-creation-dialog-panel-inputs-wrapper">
        <DialogPanelInput type={"text"} name={"type"} label="Type" />
        <DialogPanelInput type={"text"} name={"race"} label="Race" />
        <Dropdown options={[]} />
    </div>
    <DialogPanelInput type={"text"} name={"description"} label="Description" isTextarea />
    <DialogPanelButton onClick={onAddAnimalButtonClick} label={addButtonLabel} isCTA />
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent} />

<style lang="scss">
    .animal-creation-dialog-panel {
        &-inputs-wrapper {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
    }
</style>

