<script lang="ts">
    import NavbarButton from "$components/navbar/NavbarButton.svelte";
    import menuIcon from "$assets/icons/navbar/menu.svg?raw";
    import * as messages from "$lib/paraglide/messages";
    import logo from "/logo.png";

    const menuLabel = messages.navbar_menu();

    function onMenuButtonClick () {
        console.log("Menu button clicked");
    }

</script>

<header class="feed-header">
    <div class="feed-header-logo-container">
        <img alt="PawBook Logo" class="feed-header-logo" src={logo} />
        <h1 class="feed-header-logo-title">Pawbook</h1>
    </div>
    
    <div class="feed-header-more-container">
        <NavbarButton label={menuLabel} icon={menuIcon} onClick={onMenuButtonClick}/>
    </div>
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
        
        &-more-container {
            display: flex;
            align-items: center;
        }
    }
</style>