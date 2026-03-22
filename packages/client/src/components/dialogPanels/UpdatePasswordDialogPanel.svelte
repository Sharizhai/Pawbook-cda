<script lang="ts">
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import {updatePassword} from "$services/passwordServices.svelte";
    import Button from "$components/generic/Button.svelte";
    import {getTranslatedError} from "$utils/errorMapper";
    import Input from "$components/generic/Input.svelte";
    import * as messages from "$lib/paraglide/messages";
    import type {Snippet} from "svelte";

    import validationIcon from "$assets/icons/validation-ok.svg?raw";

    const panelTitle = messages.quick_action_password_update();
    const explanationText = messages.password_update_explanations();
    const currentPasswordLabel = messages.password_update_current_password_label();
    const newPasswordLabel = messages.password_update_new_password_label();
    const confirmPasswordLabel = messages.password_update_confirm_password_label();
    const panelValidationButtonLabel = messages.profile_update_dialog_panel_validation_button();
    const closeLabel = messages.close();

    let {isVisible = $bindable()}: { isVisible: boolean } = $props();

    let passwordUpdateSuccess: boolean = $state(false);
    const panelContent: Snippet[] = $derived([passwordUpdateSuccess ? successfulUpdateSnippet : contentSnippet]);

    let currentPassword: string = $state("");
    let newPassword: string = $state("");
    let confirmPassword: string = $state("");

    let errorMessage: string = $state("\u00A0");

    let isLoading: boolean = $state(false);

    let backendError: string = $state("");
    let hasCurrentPasswordError: boolean = $derived(backendError === "Invalid password");
    let hasNewPasswordError: boolean = $derived((backendError !== "" && backendError !== "Invalid password"));

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        backendError = "";

        if(currentPassword === newPassword) {
            errorMessage = messages.password_update_error_same_password();
            return;
        }

        if(newPassword !== confirmPassword) {
            errorMessage = "Les mots de passe ne correspondent pas";
            return;
        }

        try {
            isLoading = true;
            await updatePassword(currentPassword, newPassword);
            passwordUpdateSuccess = true;
        } catch (error: any) {
            backendError = error.message ?? "";
            errorMessage = getTranslatedError(error.message);
        } finally {
            isLoading = false;
        }
    }

    function onClosePanelButtonClick() {
        isVisible = false;
    }
</script>

{#snippet contentSnippet()}
    <p class="update-password-dialog-panel-form-text">{explanationText}</p>
    <form class="update-password-dialog-panel-form" onsubmit={onSubmit}>
        <Input type={"password"} name={"password"} placeholder={currentPasswordLabel} bind:value={currentPassword} hasError={hasCurrentPasswordError}/>
        <Input type={"password"} name={"password"} placeholder={newPasswordLabel} bind:value={newPassword} hasError={hasNewPasswordError}/>
        <Input type={"password"} name={"password"} placeholder={confirmPasswordLabel} bind:value={confirmPassword} hasError={hasNewPasswordError}/>

        <div class="error-message">{errorMessage}</div>

        <Button label={panelValidationButtonLabel} type="submit" isDisabled={isLoading} isCTA/>
    </form>
{/snippet}

{#snippet successfulUpdateSnippet()}
    <p class="update-password-dialog-panel-form-text">Votre mot de passe a bien été mis à jour</p>
    <span class="validation-icon">{@html validationIcon}</span>
    <Button label={closeLabel} onClick={onClosePanelButtonClick} isCTA/>
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent}/>

<style lang="scss">
    .update-password-dialog-panel-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
        gap: 0.5rem;

        &-text {
            font-size: 1rem;
            text-align: left;
            margin: 2rem 0;
        }
    }

    .validation-icon {
        width: 4.5rem;
        height: 4.5rem;
        margin-bottom: 2rem;
        color: var(--second-highlight-color);

        :global(svg) {
            width: 100%;
            height: 100%;
        }
    }
</style>