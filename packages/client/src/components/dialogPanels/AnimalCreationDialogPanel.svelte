<script lang="ts">
    import DialogPanelButton from "$components/generic/dialogPanel/DialogPanelButton.svelte";
    import DialogPanelInput from "$components/generic/dialogPanel/DialogPanelInput.svelte";
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    // import Dropdown from "$components/generic/Dropdown.svelte";
    import {isStringNotValid} from "$utils/stringUtils";
    import * as messages from "$lib/paraglide/messages";
    import {user} from "$stores/stores.svelte";
    import type {Snippet} from "svelte";
    import Input from "$components/generic/Input.svelte";

    import cameraIcon from "$assets/icons/images/camera.svg?raw";
    import {createAnimal} from "$services/animalServices";

    const panelTitle = messages.animal_creation_dialog_panel_title();
    const addButtonLabel = messages.animal_creation_dialog_panel_add();

    let { isVisible = $bindable() } : { isVisible: boolean } = $props();

    let selectedAnimalType: string = "";
    let selectedAnimalRace: string = "";

    let name: string = $state("");
    let age: number = $state(0);
    let type: string = $state("");
    let race: string = $state("");
    let profilePicture: string = $state("");
    let description: string = $state("");

    let profilePictureFile: File | null = $state(null);
    let profilePicturePreview: string = $state("");

    let errorMessage: string = $state("\u00A0");
    let fieldErrors: Record<string, string> = $state({});

    const panelContent: Snippet[] = [contentSnippet];

    function onAddAnimalButtonClick() {
        // TODO:
        // Add logic
    }

    async function registerNewAnimal(name: string, age: number, type: string, race: string, description: string, profilePicture: string) {
        try {
            const ownerId = user.information.id;
            const response = await createAnimal(
                ownerId,
                name,
                type,
                race,
                age,
                profilePicture,
                description
            );

            return response;
        } catch (error: any) {
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: any) => {
                    fieldErrors[err.field] = err.message;
                });
                errorMessage = error.message || "Erreur de validation";
            } else {
                errorMessage = error.message || "Une erreur est survenue";
            }
            return false;
        }
    }

    function onProfilePictureChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            profilePictureFile = file;
            const reader = new FileReader();

            reader.onload = (e) => {
                profilePicturePreview = e.target?.result as string;
            };

            reader.readAsDataURL(file);
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();

        errorMessage = "\u00A0";
        fieldErrors = {};

        try {
            const createdAnimal = await registerNewAnimal(name, age, type, race, description, profilePicture);

            if(!createdAnimal || !createdAnimal.id) {
                errorMessage = "Une erreur est survenue";
                return;
            }
        } catch (error: any) {
            errorMessage = error.message || "Une erreur est survenue";
        } finally {
            isVisible = false;
        }
    }
</script>

{#snippet contentSnippet()}
    <form class="animal-creation-dialog-panel-form" action="/login" method="POST" onsubmit={onSubmit}>
        <div class="animal-creation-dialog-panel-picture-wrapper">
            <div class="animal-creation-dialog-panel-picture-container">
                <img src={profilePicturePreview ? profilePicturePreview : "/paws.png"} alt="User Avatar" class="animal-creation-dialog-panel-picture" />

                <input type="file" id="profilePictureInput" class="animal-creation-dialog-panel-picture-input"
                       accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onchange={onProfilePictureChange} />
                <label for="profilePictureInput" class="animal-creation-dialog-panel-picture-upload-button" >
                                <span class="animal-creation-dialog-panel-picture-upload-button-icon">
                                    {@html cameraIcon}
                                </span>
                </label>
            </div>
        </div>
        <DialogPanelInput type={"text"} name={"name"} label="Nom" bind:value={name}/>
        <div class="animal-creation-dialog-panel-inputs-wrapper">
            <DialogPanelInput type={"number"} name={"age"} label="Age" bind:value={age}/>
        </div>
        <div class="animal-creation-dialog-panel-inputs-wrapper">
            <DialogPanelInput type={"text"} name={"type"} label="Type" bind:value={type} />
            <DialogPanelInput type={"text"} name={"race"} label="Race" bind:value={race} />
    <!--        <Dropdown options={[]} />-->
        </div>
        <DialogPanelInput type={"text"} name={"description"} label="Description" isTextarea bind:value={description} />
        <DialogPanelButton onClick={onAddAnimalButtonClick} label={addButtonLabel} isCTA />
    </form>
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent} />

<style lang="scss">
    .animal-creation-dialog-panel {
        &-form {
            display: flex;
            flex-direction: column;
            margin: 1rem 0 0 0;

            :global(.dialog-panel-button) {
                width: fit-content;
                align-self: center;
                margin: 1rem 0 0 0;
            }
        }

        &-picture-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        &-picture-container {
            flex-shrink: 0;
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            margin-right: 0.5rem;
            border: 1px solid rgba(30, 138, 182, 0.5);
            overflow: hidden;
        }

        &-picture {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &-picture-input {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }

        &-picture-upload-button {
            position: absolute;
            bottom: calc(0.5rem);
            right: calc(50% - 4rem + 0.3rem);
            width: 2.2rem;
            height: 2.2rem;
            padding: 0.22rem 0.021rem 0 0;
            border-radius: 50%;
            border: 1px solid rgba(30, 138, 182, 0.5);
            background-color: var(--main-background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

            &-icon :global(svg){
                width: 1.6rem;
                height: 1.6rem;
                color: var(--main-text-color);
            }

            &:hover {
                transform: scale(1.05);
                background-color: var(--primary-color-hover, #176d91);
            }

            &:active {
                transform: scale(0.95);
            }
        }

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

