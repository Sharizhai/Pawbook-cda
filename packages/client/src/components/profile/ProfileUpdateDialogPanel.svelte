<script lang="ts">
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import * as messages from "$lib/paraglide/messages";
    import type {Snippet} from "svelte";
    import Input from "$components/generic/Input.svelte";
    import Button from "$components/generic/Button.svelte";
    import type {PublicUserInformations} from "$types/userTypes";

    import cameraIcon from "$assets/icons/images/camera.svg?raw";

    const panelTitle = messages.profile_update_dialog_panel_title();
    const bioPlaceholder = messages.signup_bio_placeholder();
    const panelValidationButtonLabel = messages.profile_update_dialog_panel_validation_button();

    let {isVisible = $bindable(), userProfile}: { isVisible: boolean, userProfile: PublicUserInformations } = $props();

    const panelContent: Snippet[] = [contentSnippet];

    let errorMessage: string = $state("\u00A0");

    let profilePictureFile: File | null = $state(null);
    let profilePicturePreview: string = $state("");

    let profilePicture: string = $derived(profilePicturePreview !== "" ? profilePicturePreview : (userProfile.profilePicture ?? "/paws.png"));
    let profileDescription: string = $derived(userProfile.profileDescription ? userProfile.profileDescription : "");

    function onSubmit(event: Event) {
        event.preventDefault();

        errorMessage = "\u00A0";

        try {
            updateProfile(profilePicture, profileDescription);

            isVisible = false;
            profilePictureFile = null;
            profilePicturePreview = "";
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

    async function updateProfile(profilePicture: string, profileDescription: string) {
        try {

        } catch (error: any) {
            errorMessage = error.message;
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
</script>

{#snippet contentSnippet()}
    <form class="profile-update-dialog-panel-form" action="/login" method="POST" onsubmit={onSubmit}>
        <div class="profile-update-dialog-panel-form-picture-wrapper">
            <div class="profile-update-dialog-panel-form-picture-container">
                <img src={profilePicture} alt="User Avatar" class="profile-update-dialog-panel-form-picture" />

                <input type="file" id="profilePictureInput" class="profile-update-dialog-panel-form-picture-input"
                       accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onchange={onProfilePictureChange} />
                <label for="profilePictureInput" class="profile-update-dialog-panel-form-picture-upload-button" >
                            <span class="profile-update-dialog-panel-form-picture-upload-button-icon">
                                {@html cameraIcon}
                            </span>
                </label>
            </div>
        </div>
        <textarea name={"profileDescription"} bind:value={profileDescription}
                  placeholder={bioPlaceholder} class="profile-update-dialog-panel-form-profile-description"> </textarea>

        <div class="error-message">{errorMessage}</div>

        <Button label={panelValidationButtonLabel} type="submit" customClass="extra-margin-top" isCTA/>
    </form>
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent}/>

<style lang="scss">
    .profile-update-dialog-panel-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 1rem 0 0 0;

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

        &-profile-description {
            width: 100%;
            height: 5.5rem;
            resize: none;
            padding: 0.45rem 0.5rem;
            margin: 0 0 1rem 0;
            border-radius: 0.375rem;
            border: 1px solid rgba(30, 138, 182, 0.5);
            background-color: rgba(var(--main-background-color), 0.9);
            color: var(--main-text-color);
            font-size: 1rem;

            &:hover {
                color: var(--second-highlight-color);
                border: 1px solid var(--second-highlight-color);
            }

            &:focus-visible {
                border: 1px solid var(--second-highlight-color);
                outline: none;
            }

            &:focus {
                outline: none;
            }
        }
    }
</style>