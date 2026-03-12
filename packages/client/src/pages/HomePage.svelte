<svelte:head>
  <title>Pawbook home</title>
</svelte:head>

<script lang="ts">
    import LanguageDropdown from "$components/LanguageDropdown.svelte";
    import Button from "$components/generic/Button.svelte";
    import * as messages from "$lib/paraglide/messages";
    import { link, push } from "svelte-spa-router";
    import paws from "/paws.png";
  
    const catchphraseLabel = messages.website_catchphrase();
    const connectionLabel = messages.home_connection();
    const inscriptionLabel = messages.home_inscription();
    const gcuLabel = messages.home_gcu();

    const logo = import.meta.env.VITE_LOGO_URL;

    function onConnectionButtonClick() {
        push("/login");
    }

    function onInscriptionButtonClick() {
        push("/signup");
    }
    
  </script>
  
  <main class="home-container">
    <div class="language-dropdown-container">
      <LanguageDropdown />
    </div>

    <div class="home-background"></div>

    <img alt="PawBook Logo" class="home-logo" src={logo} />
    <h1 class="home-title">Pawbook</h1>
    <p class="home-catchphrase">{catchphraseLabel}</p>

    <Button label={inscriptionLabel} onClick={onInscriptionButtonClick} customClass="extra-margin" isCTA hadShadow/>
    <Button label={connectionLabel} onClick={onConnectionButtonClick} hadShadow/>
    <footer class="home-footer">
      <a href="/gcu" use:link class="home-footer-link">{gcuLabel}</a>
      <p class="home-footer-content">© Pawbook 2024 - 2025</p>
      <p class="home-footer-content">All rights reserved</p>
    </footer>
  </main>
  
  <style lang="scss">
    .home {
      &-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      &-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('/paws.png');
        background-size: 68rem auto;
        background-position: center;
        background-repeat: no-repeat;
        z-index: -2;
        opacity: 0.2;
      }

      &-logo {
        width: 22rem;
        height: 22rem;
        margin: 0;
      }

      &-title {
        font-family: var(--title-font-family);
        text-align: center;
        font-size: 3.5rem;
        margin: 0;
      }

      &-catchphrase{
        font-size: 1rem;
        margin: 0.5rem 0 4rem 0;
      }

      &-footer {
        position: absolute;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        padding: 0 0 0.5rem 0;

        &-content {
          margin: 0;
        }

        &-link {
          color: inherit;
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 0.2rem;

          &:hover {
              color: var(--second-highlight-color);
          }
        }
      }
    }

    .language-dropdown-container {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    :global(.extra-margin) {
      margin: 0 0 1rem 0;
    }
  </style>