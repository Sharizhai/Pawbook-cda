<svelte:head>
  <title>Pawbook forgotten password</title>
</svelte:head>

<script lang="ts">
    import LanguageDropdown from "$components/LanguageDropdown.svelte";
    import BackButton from "$components/generic/BackButton.svelte";
    import Button from "$components/generic/Button.svelte";
    import * as messages from "$lib/paraglide/messages";
    import Input from "$components/generic/Input.svelte";
    import { link, push } from "svelte-spa-router";

    const logo = import.meta.env.VITE_LOGO_URL;

    const backButtonLabel = messages.forgotten_password_back_button();
    const emailLabel = messages.email();
    const emailPlaceholder = messages.email_placholder();
    const passwordResetLabel = messages.forgotten_password_reset();
    const gcuLabel = messages.home_gcu();

    function onPasswordResetButtonClick() {
        // TODO : Implement login logic
    }

    function onBackButtonClick() {
        push("/login");
    }

</script>

    <main id="reset-password-page-container">
        <div class="language-dropdown-container">
            <LanguageDropdown />
        </div>

        <div class="reset-password-page-background"></div>

        <img alt="PawBook Logo" class="reset-password-page-logo" src={logo} />
        <h1 class="reset-password-page-title">Pawbook</h1>

        <div class="reset-password-page-form-container">
            <form class="reset-password-page-form">
                <BackButton customClass="back-button" onClick={onBackButtonClick} label={backButtonLabel}/>
                <Input label={emailLabel} type={"email"} name={"email"} placeholder={emailPlaceholder}/>
                <Button label={passwordResetLabel} onClick={onPasswordResetButtonClick} customClass="extra-margin-top" isCTA/>
            </form>
        </div>

        <footer class="reset-password-page-footer">
            <a href="/gcu" use:link class="reset-password-page-footer-link">{gcuLabel}</a>
            <p class="reset-password-page-footer-content">© Pawbook 2024 - 2025</p>
            <p class="reset-password-page-footer-content">All rights reserved</p>
          </footer>
    </main>

<style lang="scss">
    #reset-password-page-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .language-dropdown-container {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .reset-password-page {
        &-logo {
            width: 18rem;
            height: 18rem;
            margin: 0;
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

        &-title {
            font-family: var(--title-font-family);
            text-align: center;
            font-size: 3.5rem;
            margin: 0;
        }

        &-form-container {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--second-text-color);
            border-radius: 0.75rem;
            margin: 2rem 0 2rem 0;
            padding : 4.25rem 1.25rem 1.25rem 1.25rem;
            width: 90%;
            max-width: 40rem;
            backdrop-filter: blur(3px);
        }

        &-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
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
                font-size: 0.8rem;
                text-decoration: underline;
                cursor: pointer;
                margin-bottom: 0.2rem;

                &:hover {
                    color: var(--second-highlight-color);
                }
            }
        }
    }

    :global(.back-button) {
        position: absolute;
        top: 1rem;
        left: 1rem;
    }

    :global(.extra-margin-top) {
        margin-top: 1rem;
    }

    :global(.reset-password-page-form-input-no-margin) {
        margin-bottom: 0.3rem !important;
    }
</style>