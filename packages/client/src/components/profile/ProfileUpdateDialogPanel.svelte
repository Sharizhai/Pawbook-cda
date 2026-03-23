<script lang="ts">
    import type {PublicUserInformations, UserUpdateInformations} from "$types/userTypes";
    import AnimatedCheckIcon from "$components/animated/AnimatedCheckIcon.svelte";
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import {updateUserInformations} from "$services/userServices.svelte";
    import {uploadProfilePicture} from "$services/photosServices.svelte";
    import Button from "$components/generic/Button.svelte";
    import * as messages from "$lib/paraglide/messages";
    import {user} from "\$stores/stores.svelte";
    import type {Snippet} from "svelte";

    import cameraIcon from "$assets/icons/images/camera.svg?raw";
    import {edition} from "$stores/stores.svelte";

    const panelTitle = messages.profile_update_dialog_panel_title();
    const bioPlaceholder = messages.signup_bio_placeholder();
    const panelValidationButtonLabel = messages.profile_update_dialog_panel_validation_button();
    const successUpdateLabel = messages.profile_update_success_message();
    const closeLabel = messages.close();

    let {isVisible = $bindable(), userProfile = $bindable() }: { isVisible: boolean, userProfile: PublicUserInformations } = $props();

    let profileUpdateSuccess: boolean = $state(false);
    const panelContent: Snippet[] = $derived([profileUpdateSuccess ? successfulUpdateSnippet : contentSnippet]);

    let errorMessage: string = $state("\u00A0");

    let profilePictureFile: File | null = $state(null);
    let profilePicturePreview: string = $state("");

    let profilePicture: string = $state(userProfile.profilePicture ?? "/paws.png");
    let profileDescription: string = $state(userProfile.profileDescription ?? "");

    let profilePictureDisplay = $derived(profilePicturePreview !== "" ? profilePicturePreview : profilePicture);

    $effect(() => {
        if (isVisible) {
            edition.startEditing<UserUpdateInformations>({
                profilePicture: userProfile.profilePicture,
                profileDescription: userProfile.profileDescription
            });
        } else {
            profilePicture = userProfile.profilePicture ?? "/paws.png";
            profileDescription = userProfile.profileDescription ?? "";
            profilePicturePreview = "";
            profilePictureFile = null;
            profileUpdateSuccess = false;
        }
    })

    async function onSubmit(event: Event) {
        event.preventDefault();
        errorMessage = "\u00A0";

        try {
            let updatedUser = await updateUserInformations(userProfile.id, { profilePicture, profileDescription });

            if (profilePictureFile) {
                const updatedPicture = await uploadProfilePicture(userProfile.id, profilePictureFile);
                updatedUser = { ...updatedUser, profilePicture: updatedPicture.profilePicture };
            }

            user.information = { ...user.information, ...updatedUser };
            userProfile = { ...userProfile, ...updatedUser };

            profileUpdateSuccess = true;
            edition.stopEditing();
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
                edition.patch<UserUpdateInformations>({ profilePicture: profilePicturePreview });
            };

            reader.readAsDataURL(file);
        }
    }

    function onDescriptionChange(value: string) {
        profileDescription = value;
        edition.patch<UserUpdateInformations>({ profileDescription: value });
    }

    function onClosePanelButtonClick() {
        isVisible = false;
    }
</script>

{#snippet contentSnippet()}
    <form class="profile-update-dialog-panel-form" onsubmit={onSubmit}>
        <div class="profile-update-dialog-panel-form-picture-wrapper">
            <div class="profile-update-dialog-panel-form-picture-container">
                <img src={profilePictureDisplay} alt="User Avatar" class="profile-update-dialog-panel-form-picture" />

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
                  placeholder={bioPlaceholder} class="profile-update-dialog-panel-form-profile-description"
                  oninput={(e) => onDescriptionChange(e.currentTarget.value)}> </textarea>

        <div class="error-message">{errorMessage}</div>

        <Button label={panelValidationButtonLabel} isDisabled={!edition.hasChanges} type="submit" customClass="extra-margin-top" isCTA/>
    </form>
{/snippet}

{#snippet successfulUpdateSnippet()}
    <div class="profile-update-dialog-panel-form-validation">
        <p class="profile-update-dialog-panel-form-validation-text">{successUpdateLabel}</p>
        <AnimatedCheckIcon />
        <Button label={closeLabel} onClick={onClosePanelButtonClick} isCTA/>
    </div>
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

        &-validation {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;

            &-text {
                font-size: 1rem;

                text-align: left;
                margin: 2rem 0 0 0;
            }
        }
    }
</style>