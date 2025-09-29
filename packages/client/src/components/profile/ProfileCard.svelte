<script lang="ts">
    import QuickActionsMenu from "$components/generic/quickActionsMenu/QuickActionsMenu.svelte";
    import type {QuickActionsMenuActionProperties} from "$types/quickActionsMenuTypes";
    import SettingsButton from "$components/generic/SettingsButton.svelte";
    import {authLogout} from "$services/authServices.svelte";
    import Button from "$components/generic/Button.svelte";
    import * as messages from "$lib/paraglide/messages";

    import deleteIcon from "$assets/icons/delete.svg?raw";
    import logoutIcon from "$assets/icons/logout.svg?raw";
    import editIcon from "$assets/icons/edit.svg?raw";
    import gcuIcon from "$assets/icons/gcu.svg?raw";

    const updateProfileLabel = messages.quick_action_profile_update();
    const gcuLabel = messages.home_gcu();
    const logoutLabel = messages.logout();
    const deleteLabel = messages.quick_action_profile_delete();

    let {
        customClass,
        profilePicture,
        firstName,
        lastName,
        description
    } : {
        customClass?: string,
        profilePicture?: string,
        firstName: string,
        lastName: string,
        description?: string
    } = $props();

    let isQuickActionsMenuOpen = $state(false);

    let settingsQuickActionsMenuActionProperties: QuickActionsMenuActionProperties[] = $derived([
        {
            icon: editIcon,
            label: updateProfileLabel,
            onClick: onQuickActionUpdateProfileButtonClick
        },
        {
            icon: gcuIcon,
            label: gcuLabel,
            onClick: onQuickActionGcuButtonClick
        },
        {
            icon: logoutIcon,
            label: logoutLabel,
            onClick: onQuickActionDisconnectButtonClick
        },
        {
            icon: deleteIcon,
            label: deleteLabel,
            onClick: onQuickActionDeleteAccountButtonClick,
            isWarningAction: true
        }
    ])

    function onFollowButtonClick() {

    }

    function onSettingsButtonClick() {
        isQuickActionsMenuOpen = !isQuickActionsMenuOpen;
    }

    function onQuickActionUpdateProfileButtonClick() {

    }

    function onQuickActionGcuButtonClick() {

    }

    function onQuickActionDisconnectButtonClick() {
        authLogout();
    }

    function onQuickActionDeleteAccountButtonClick() {

    }
</script>
    <div class="profile-card-container {customClass ?? ''}">
        <SettingsButton onClick={onSettingsButtonClick} customClass="profile-card-settings-button" />
        <div class="profile-card-container-user-infos">
            <div class="profile-card-container-user-infos-avatar-container">
                <img src={profilePicture ? profilePicture : "/paws.png"} alt="User Avatar" class="profile-card-container-user-infos-avatar" />
            </div>

            <div class="profile-card-container-user-infos-container">
                <div class="profile-card-container-user-infos-container-name">{firstName} {lastName}</div>
                <div class="profile-card-container-user-infos-container-description">{description}</div>
            </div>
        </div>

        <div class="profile-card-container-user-infos-buttons-container">
                <!-- TODO :
                if profile = user profile => add followers & followed buttons -->
            <Button label="Suivre" onClick={onFollowButtonClick} isCTA hadShadow/>
        </div>
    </div>

<QuickActionsMenu isVisible={isQuickActionsMenuOpen} actions={settingsQuickActionsMenuActionProperties} top={"1rem"} right={"3rem"} haslanguageDropdown />

<style lang="scss">
    .profile-card-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: var(--main-background-color);
        border-radius: 1rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-bottom: 1rem;
        padding: 0.625rem;

        &-user-infos {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;

            &-avatar-container {
                flex-shrink: 0;
                width: 8rem;
                height: 8rem;
                border-radius: 50%;
                margin-right: 0.5rem;
                border: 1px solid rgba(30, 138, 182, 0.4);
                overflow: hidden;
            }

            &-avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            &-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;

                &-name {
                    font-size: 1rem;
                    font-weight: bold;
                }

                &-description {
                    font-size: 0.85rem;
                    color: var(--second-text-color);
                }
            }

            &-buttons-container {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: flex-end;
                align-items: center;
                gap: 0.5rem;
                margin: 1rem 0 0 0;
            }
        }
    }

    :global(.profile-card-settings-button) {
        position: absolute;
        top: 0.5rem;
        right: 0.2rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
</style>