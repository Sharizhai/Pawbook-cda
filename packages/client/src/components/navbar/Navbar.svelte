<script lang="ts">
    import PostCreationDialogPanel from "$components/dialogPanels/PostCreationDialogPanel.svelte";
    import * as messages from "$lib/paraglide/messages";
    import NavbarButton from "./NavbarButton.svelte";
    import {user} from "$stores/stores.svelte";
    import { push } from "svelte-spa-router";
    import logo from "/logo.png";

    import notificationIcon from "$assets/icons/navbar/notification.svg?raw";
    import profileIcon from "$assets/icons/navbar/profile.svg?raw";
    import searchIcon from "$assets/icons/navbar/search.svg?raw";
    import menuIcon from "$assets/icons/navbar/menu.svg?raw";
    import homeIcon from "$assets/icons/navbar/home.svg?raw";
    import addIcon from "$assets/icons/navbar/add.svg?raw";

    const notificationLabel = messages.navbar_notifications();
    const profileLabel = messages.navbar_profile();
    const searchLabel = messages.navbar_search();
    const homeLabel = messages.navbar_home();
    const menuLabel = messages.navbar_menu();
    const addLabel = messages.navbar_add();

    let isPostCreationDialogPanelOpen = false;

    function onHomeButtonClick() {
        push("/feed");
    }

    function onSearchButtonClick() {
        // Handle search button click
        console.log("Search button clicked");
    }

    function onAddButtonClick() {
        isPostCreationDialogPanelOpen = true;
    }

    function onNotificationButtonClick() {
        // Handle notification button click
        console.log("Notification button clicked");
    }

    function onProfileButtonClick() {
        const currentUserId = user.information?.id;

        if (currentUserId) push(`/profile/${currentUserId}`);
    }

    function onMenuButtonClick() {
        // Handle menu button click
        console.log("Menu button clicked");
    }
</script>

    <nav id="navbar-container">

        <div class="navbar-logo-container">
            <img alt="Pawbook Logo" class="navbar-logo" src={logo} />
            <h1 class="navbar-logo-title">Pawbook</h1>
        </div>

        <div class="navbar-items-container">
            <NavbarButton label={homeLabel} icon={homeIcon} onClick={onHomeButtonClick}/>
            <NavbarButton label={searchLabel} icon={searchIcon} onClick={onSearchButtonClick}/>
            <NavbarButton label={addLabel} icon={addIcon} onClick={onAddButtonClick}/>
            <NavbarButton label={notificationLabel} icon={notificationIcon} onClick={onNotificationButtonClick}/>
            <NavbarButton label={profileLabel} icon={profileIcon} onClick={onProfileButtonClick}/>
        </div>

        <div class="navbar-more-container">
            <NavbarButton label={menuLabel} icon={menuIcon} onClick={onMenuButtonClick}/>
        </div>
    </nav>

<PostCreationDialogPanel bind:isVisible={isPostCreationDialogPanelOpen}/>

<style lang="scss">
    #navbar-container {
        display: flex;
        position: fixed;
        bottom: 0;
        justify-content: space-evenly;
        align-items: flex-start;
        width: 100%;
        height: 80px;
        background-color: var(--main-background-color);
        border-top: 1px solid var(--second-highlight-color);
        z-index: 10;

        @media only screen and (min-width: 1200px) {
            justify-content: flex-end;
            top: 0;
            height: 60px;
            border-bottom: 1px solid var(--second-highlight-color);
            border-top: none;
            background-color: transparent;
            backdrop-filter: blur(3px);
        }
    }

    .navbar-logo-container {
        justify-content: center;
        justify-self: flex-start;
        height: 100%;
        display: none;

        @media only screen and (min-width: 1200px) {
            display: flex;
            align-items: center;
        }
    }

    .navbar-logo {
        width: 3rem;
        height: 3rem;
        margin: 0 1rem;

        &-title {
            font-size: 2.5rem;
            font-family: var(--title-font-family);
            font-weight: bold;
            margin: 0;
        }
    }

    .navbar-items-container {
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        width: 100%;
        height: 100%;

        @media only screen and (min-width: 1200px) {
            justify-content: flex-end;
            align-items: center;
            gap: 1rem;
        }
    }

    .navbar-more-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        display: none;

        @media only screen and (min-width: 1200px) {
            display: flex;
            justify-self: flex-end;
            align-items: center;
            width: auto;
            margin-left: 1rem;
        }
    }
</style>