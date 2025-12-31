<script lang="ts">
    import PostCreationDialogPanel from "$components/dialogPanels/PostCreationDialogPanel.svelte";
    import {fetchUserInformations} from "$services/userServices.svelte";
    import * as messages from "$lib/paraglide/messages";
    import {user, follow} from "$stores/stores.svelte";
    import NavbarButton from "./NavbarButton.svelte";
    import { push } from "svelte-spa-router";
    import {onMount} from "svelte";
    import logo from "/logo.png";

    import statsIcon from "$assets/icons/navbar/stats.svg?raw";
    import usersIcon from "$assets/icons/navbar/users.svg?raw";
    import moderationIcon from "$assets/icons/navbar/moderation.svg?raw";

    const moderationLabel = messages.navbar_moderation();
    const usersLabel = messages.navbar_users();
    const statsLabel = messages.navbar_stats();

    onMount(() => {
        loadData();
    })

    async function loadData() {
        if (user.accessToken) {
            try {
                const userData = await fetchUserInformations();
                user.information = userData;

                if (userData.follows) {
                    follow.setFollowing(userData.follows.map(id => ({
                        id: "",
                        followerId: userData.id,
                        followingId: id,
                        createdAt: new Date().toISOString()
                    })));
                }
            } catch (error) {
                console.error("Failed to load initial user data", error);
            }
        }
    }

    function onStatsButtonClick() {

    }

    function onPostsModerationButtonClick() {

    }

    function onUsersListButtonClick() {

    }
</script>

<nav id="admin-navbar-container">
    <div class="admin-navbar-logo-container">
        <img alt="Pawbook Logo" class="admin-navbar-logo" src={logo} />
        <h1 class="admin-navbar-logo-title">Pawbook</h1>
    </div>

    <div class="admin-navbar-items-container">
        {#if user.isAdmin}
            <NavbarButton label={statsLabel} icon={statsIcon} onClick={onStatsButtonClick}/>
        {/if}
        <NavbarButton label={usersLabel} icon={usersIcon} onClick={onUsersListButtonClick}/>
        <NavbarButton label={moderationLabel} icon={moderationIcon} onClick={onPostsModerationButtonClick}/>
    </div>
</nav>

<style lang="scss">
    #admin-navbar-container {
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

    .admin-navbar-logo-container {
        justify-content: center;
        justify-self: flex-start;
        height: 100%;
        display: none;

        @media only screen and (min-width: 1200px) {
            display: flex;
            align-items: center;
        }
    }

    .admin-navbar-logo {
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

    .admin-navbar-items-container {
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
</style>