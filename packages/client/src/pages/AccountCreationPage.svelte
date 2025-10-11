<svelte:head>
  <title>Pawbook signup</title>
</svelte:head>

<script lang="ts">
    import LanguageDropdown from "$components/LanguageDropdown.svelte";
    import Button from "$components/generic/Button.svelte";
    import * as messages from "$lib/paraglide/messages";
    import Input from "$components/generic/Input.svelte";
    import { push } from "svelte-spa-router";
    import {createUser} from "$services/userServices.svelte";

    import cameraIcon from "$assets/icons/images/camera.svg?raw";

    const incentiveLabel = messages.signup_incentive();
    const emailPlaceholder = messages.signup_email_placeholder();
    const passwordPlaceholder = messages.signup_password_placeholder();
    const confirmPasswordPlaceholder = messages.signup_confirm_password_placeholder();
    const usernamePlaceholder = messages.signup_username_placeholder();
    const firstNamePlaceholder = messages.signup_first_name_placeholder();
    const lastNamePlaceholder = messages.signup_last_name_placeholder();
    const bioPlaceholder = messages.signup_bio_placeholder();
    const alreadyAnAccountabel = messages.signup_already_have_account();
    const connexionLabel = messages.home_connection();
    const createMyAccount = messages.signup_create_account();
    const gcuLabel = messages.signup_gcu_privacy_policy();

    let errorMessage: string = $state("\u00A0");
    let fieldErrors: Record<string, string> = $state({});

    let name: string = $state("");
    let firstName: string = $state("");
    let email: string = $state("");
    let password: string = $state("");
    let confirmPassword: string = $state("");
    let profilePicture: string = $state("");
    let profileDescription: string = $state("");
    let gcu: boolean = $state(false);

    let profilePictureFile: File | null = $state(null);
    let profilePicturePreview: string = $state("");

    function onLoginButtonClick() {
        push("/login");
    }

    async function onSubmit(event: Event) {
        event.preventDefault();

        errorMessage = "\u00A0";
        fieldErrors = {};

        if(!gcu) {
            errorMessage = "Vous devez accepter nos conditions générales d'utilisation";
            return;
        }

        if(password !== confirmPassword) {
            errorMessage = "Les mots de passe ne correspondent pas";
            return;
        }

        let uploadedImageUrl = "";
        if (profilePictureFile) {
            // TODO: Implémenter l'upload vers Cloudinary
            // uploadedImageUrl = await uploadToCloudinary(profilePictureFile);
            profilePicture = profilePicturePreview; // Temporaire
        }

        const submitResponse = await registerNewAccount(name, firstName, email, password, profilePicture, profileDescription);

        if(!submitResponse) return;

        push("/login");
    }

    async function registerNewAccount(name: string, firstName:string, email: string, password: string, profilePicture: string, profileDescription: string) {
        try {
            const response = await createUser(name, firstName, email, password, profilePicture, profileDescription);
            return response;
        } catch (error: any) {
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: any) => {
                    fieldErrors[err.field] = err.message;
                });
                errorMessage = error.message || "Erreur de validation";
            } else {
                errorMessage = error.message || "Une erreur est survenue";
            }
            return false;
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
            };

            reader.readAsDataURL(file);
        }
    }
</script>

    <main id="login-page-container">
        <div class="language-dropdown-container">
            <LanguageDropdown />
        </div>

        <div class="login-page-background"></div>

        <h1 class="login-page-title">Pawbook</h1>
        <p class="login-page-incentive">{incentiveLabel}</p>

        <div class="login-page-form-container">
            <form class="login-page-form" action="/login" method="POST" onsubmit={onSubmit}>
                <div class="login-page-form-picture-wrapper">
                    <div class="login-page-form-picture-container">
                        <img src={profilePicturePreview ? profilePicturePreview : "/paws.png"} alt="User Avatar" class="login-page-form-picture" />

                        <input type="file" id="profilePictureInput" class="login-page-form-picture-input"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onchange={onProfilePictureChange} />
                        <label for="profilePictureInput" class="login-page-form-picture-upload-button" >
                            <span class="login-page-form-picture-upload-button-icon">
                                {@html cameraIcon}
                            </span>
                        </label>
                    </div>
                </div>
                <Input type={"email"} name={"email"} bind:value={email}
                       placeholder={emailPlaceholder}/>
                <Input type={"password"} name={"password"}  bind:value={password}
                       placeholder={passwordPlaceholder}/>
                <Input type={"password"} name={"confirmPassword"} bind:value={confirmPassword}
                       placeholder={confirmPasswordPlaceholder}/>
<!--                <Input type={"text"} name={"userName"} bind:value={name}-->
<!--                       placeholder={usernamePlaceholder}/>-->
                <div class="login-page-form-names-container">
                  <Input type={"text"} name={"firstName"} bind:value={firstName}
                         placeholder={firstNamePlaceholder}
                         customClass={"login-page-form-names-container-fist-name"} />
                  <Input type={"text"} name={"lastName"} bind:value={name}
                         placeholder={lastNamePlaceholder}
                         customClass={"login-page-form-names-container-last-name"} />
                </div>
                <textarea name={"profileDescription"} bind:value={profileDescription}
                       placeholder={bioPlaceholder} class="login-page-form-profile-description"> </textarea>

                <div class="login-page-form-gcu-container">
                    <Input type={"checkbox"} name={"gcu"} bind:checked={gcu}
                           customClass={"login-page-form-input-no-margin"} placeholder={gcuLabel}/>
                </div>

                <div class="error-message">{errorMessage}</div>

                <Button label={createMyAccount} type="submit" customClass="extra-margin-top" isCTA/>
            </form>
        </div>

        <div class="login-page-no-account-container">
            <p class="login-page-no-account-sentence">{alreadyAnAccountabel}</p>
            <Button label={connexionLabel} onClick={onLoginButtonClick}/>
        </div>

        <footer class="login-page-footer">
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

        &-title {
            font-family: var(--title-font-family);
            text-align: center;
            font-size: 3.5rem;
            margin: 0;
        }

        &-incentive {
            font-size: 1rem;
            margin: 0.5rem 0 0 0;
            text-align: center;
            
        }

        &-form-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--second-text-color);
            border-radius: 0.75rem;
            margin: 2rem 0 1rem 0;
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

            &-names-container {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              gap: 0.5rem;
            }

            &-profile-description {
                width: 100%;
                height: 5.5rem;
                resize: none;
                padding: 0.45rem 0.5rem;
                margin: 0 0 1rem 0;
                border-radius: 0.375rem;
                border: 1px solid rgba(30, 138, 182, 0.5);
                background-color: rgba(255, 255, 255, 0.5);
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

            &-gcu-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin: 0.5rem 0 0 0;
                width: 100%;
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
        }
    }

    :global(.extra-margin-top) {
        margin-top: 1rem;
    }

    :global(.login-page-form-input-no-margin) {
        margin-bottom: 0.3rem !important;
    }

    :global(.login-page-form-names-container-fist-name) {
        width: 35% !important;
    }
    :global(.login-page-form-names-container-last-name) {
        width: 65% !important;
    }

    .login-page-form-picture-input:focus + .login-page-form-picture-upload-button {
        outline: 2px solid rgba(30, 138, 182, 1);
        outline-offset: 2px;
    }
</style>