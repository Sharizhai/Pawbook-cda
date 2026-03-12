<script lang="ts">
    import NavbarButton from "$components/navbar/NavbarButton.svelte";
    import * as messages from "$lib/paraglide/messages";
    import {user} from "$stores/stores.svelte";

    import adminIcon from "$assets/icons/navbar/administration.svg?raw";
    import menuIcon from "$assets/icons/navbar/menu.svg?raw";
    import {push, location} from "svelte-spa-router";

    const logo = import.meta.env.VITE_LOGO_URL;

    const administrationLabel = messages.navbar_administration();
    const menuLabel = messages.navbar_menu();

    function onMenuButtonClick () {
        console.log("Menu button clicked");
    }

    function onAdministrationButtonClick () {
        push("/administration");
    }

    function onLogoButtonClick () {
        push("/feed");
    }
</script>

<header class="feed-header">
    <div class="feed-header-logo-container">
        {#if $location === '/administration'}
            <button class="feed-header-logo-button" onclick={onLogoButtonClick}>
                <img alt="PawBook Logo" class="feed-header-logo" src={logo} />
                <h1 class="feed-header-logo-title">Pawbook</h1></button>
        {:else}
        <img alt="PawBook Logo" class="feed-header-logo" src={logo} />
        <h1 class="feed-header-logo-title">Pawbook</h1>
        {/if}
    </div>
    
    {#if $location !== '/administration'}
    <div class="feed-header-more-container">
        {#if user.isAdmin || user.isModerator}
            <NavbarButton label={administrationLabel} icon={adminIcon} onClick={onAdministrationButtonClick}/>
        {/if}
        <NavbarButton label={menuLabel} icon={menuIcon} onClick={onMenuButtonClick}/>
    </div>
    {/if}
</header>

<style lang="scss">
    .feed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 60px;
        padding: 0 1rem;
        background-color: var(--main-background-color);
        border-bottom: 1px solid var(--second-highlight-color);
        position: fixed;
        top: 0;
        z-index: 10;
        
        @media only screen and (min-width: 1200px) {
            display: none;
        }
        
        &-logo-container {
            display: flex;
            align-items: center;
        }
        
        &-logo {
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 0.5rem;
            
            &-title {
                font-size: 1.8rem;
                font-family: var(--title-font-family);
                font-weight: bold;
                margin: 0;
            }
        }

        &-logo-button {
            display: flex;
            align-items: center;
            padding: 0;
            margin: 0;
            border: none;
            color: inherit;
            background-color: transparent;
        }
        
        &-more-container {
            display: flex;
            align-items: center;
        }
    }
</style>