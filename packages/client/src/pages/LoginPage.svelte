<svelte:head>
  <title>Pawbook login</title>
</svelte:head>

<script lang="ts">
    import LanguageDropdown from "$components/LanguageDropdown.svelte";
    import {authLogin} from "$services/authServices.svelte";
    import Button from "$components/generic/Button.svelte";
    import Input from "$components/generic/Input.svelte";
    import * as messages from "$lib/paraglide/messages";
    import { link, push } from "svelte-spa-router";
    import logo from "/logo.png";

    const emailLabel = messages.email();
    const emailPlaceholder = messages.email_placholder();
    const passwordLabel = messages.password();
    const passwordPlaceholder = messages.password_placeholder();
    const loginLabel = messages.login_connexion();
    const passwordForgotten = messages.login_forgotten_password();
    const noAccount = messages.login_no_account();
    const createAccount = messages.login_create_account();
    const gcuLabel = messages.home_gcu();

    let errorMessage: string = $state(" ");

    let email: string = $state("");
    let password: string = $state("");

    function onCreateAccountButtonClick() {
        push("/signup");
    }

    async function onSubmit(event: Event) {
        event.preventDefault();

        console.log(email, password);

        if (!email || !password) {
            errorMessage = "Veuillez remplir tous les champs";
            return;
        }

        if (!email.includes("@")) {
            errorMessage = "Veuillez entrer un email valide";
            return;
        }

        const submitResponse = await signIn(email, password);

        if(!submitResponse) return;

        push("/feed");
    }

    async function signIn(email: string, password: string) {
        errorMessage = " ";

        const response = await authLogin(email, password)
            .catch((error) => {
                errorMessage = error.message;
            });

        return response;
    }

</script>

    <main id="login-page-container">
        <div class="language-dropdown-container">
            <LanguageDropdown />
        </div>

        <div class="login-page-background"></div>

        <img alt="PawBook Logo" class="login-page-logo" src={logo} />
        <h1 class="login-page-title">Pawbook</h1>

        <div class="login-page-form-container">
            <form class="login-page-form" action="/login" method="POST" onsubmit={onSubmit}>
                <Input label={emailLabel} type={"email"} name={"email"} placeholder={emailPlaceholder} bind:value={email} />
                <Input label={passwordLabel} type={"password"} name={"password"} placeholder={passwordPlaceholder} bind:value={password} customClass={"login-page-form-input-no-margin"}/>
                <a href="/forgotten-password" use:link class="login-page-form-link">{passwordForgotten}</a>
                <Button label={loginLabel} type="submit" customClass="extra-margin-top"/>
            </form>
        </div>

        <div class="login-page-no-account-container">
            <p class="login-page-no-account-sentence">{noAccount}</p>
            <Button label={createAccount} onClick={onCreateAccountButtonClick} isCTA />
        </div>

        <footer class="login-page-footer">
            <a href="/gcu" use:link class="login-page-footer-link">{gcuLabel}</a>
            <p class="login-page-footer-content">© Pawbook 2024 - 2025</p>
            <p class="login-page-footer-content">All rights reserved</p>
          </footer>
    </main>

<style lang="scss">
    #login-page-container {
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

    .login-page {
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
            width: 18rem;
            height: 18rem;
            margin: 0;
        }

        &-title {
            font-family: var(--title-font-family);
            text-align: center;
            font-size: 3.5rem;
            margin: 0;
        }

        &-form-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--second-text-color);
            border-radius: 0.75rem;
            margin: 2rem 0 2rem 0;
            padding : 1.25rem;
            width: 90%;
            max-width: 40rem;
            backdrop-filter: blur(3px);
        }

        &-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;

            &-link {
                font-size: 0.8rem;
                text-decoration: underline;
                cursor: pointer;

                &:hover {
                    color: var(--second-highlight-color);
                }
            }
        }

        &-no-account {
            &-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0;
            }

            &-sentence {
                font-size: 0.9rem;
                margin: 0 0 0.3rem 0;
            }       
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

    :global(.extra-margin-top) {
        margin-top: 1rem;
    }

    :global(.login-page-form-input-no-margin) {
        margin-bottom: 0.3rem !important;
    }
</style>