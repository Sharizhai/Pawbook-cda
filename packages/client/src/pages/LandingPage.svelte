<svelte:head>
    <title>Pawbook - Réseau social pour propriétaires d'animaux de compagnie</title>
    <meta name="description" content="Rejoignez Pawbook, la communauté en ligne dédiée aux propriétaires de chiens, chats et autres animaux de compagnie. Partagez vos photos, vos conseils et vos moments précieux avec d'autres passionnés." />

    <!-- Open Graph pour les réseaux sociaux -->
    <meta property="og:title" content="Pawbook - Réseau Social pour Animaux de Compagnie" />
    <meta property="og:description" content="La communauté en ligne des propriétaires d'animaux. Partagez et découvrez des moments uniques avec vos compagnons." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://pawbook.com" />
    <meta property="og:image" content="https://pawbook.com/og-image.jpg" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Pawbook - Réseau Social pour Animaux" />
    <meta name="twitter:description" content="La communauté des propriétaires d'animaux de compagnie" />
    <meta name="twitter:image" content="/logo.png" />

    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://pawbook.com" />
    <html lang="fr"></html>
</svelte:head>

<script lang="ts">
    import FeatureCard from "$components/landingPage/FeatureCard.svelte";
    import LanguageDropdown from "$components/LanguageDropdown.svelte";
    import Button from "$components/generic/Button.svelte";
    import featuresData from "../data/featuresData.json";
    import opinionsData from "../data/opinionsData.json";
    import * as messages from "$lib/paraglide/messages";
    import {isMobile} from "$utils/deviceUtils";
    import {push, link} from "svelte-spa-router";
    import logo from "/logo.png";

    import cameraIcon from "$assets/icons/images/camera.svg?raw";
    import groupIcon from "$assets/icons/features/group.svg?raw";
    import messagesIcon from "$assets/icons/features/messages.svg?raw";
    import celebrationIcon from "$assets/icons/features/celebration.svg?raw";
    import OpinionCard from "$components/landingPage/OpinionCard.svelte";
    import {authLogin} from "$services/authServices.svelte";
    import Input from "$components/generic/Input.svelte";
    import {uploadProfilePicture} from "$services/photosServices.svelte";
    import {createUser} from "$services/userServices.svelte";

    const connectionLabel = messages.home_connection();
    const inscriptionLabel = messages.home_inscription();
    const gcuFoorterLabel = messages.home_gcu();

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

    let heroImage: string = $state(isMobile() ? "/hero-image.jpg" : "/hero-image-desktop.jpg");
    let sectionLayout: string = $state(!isMobile() ? "desktop-layout" : "");
    let heroDirection: string = $state(isMobile() ? "column" : "row");
    let imageButtonClass: string = "image-button";

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

    const iconMap: Record<string, string> = {
        camera: cameraIcon,
        users: groupIcon,
        messages: messagesIcon,
        celebration: celebrationIcon
    };

    const featuresWithIcons = featuresData.map(feature => ({
        ...feature,
        icon: iconMap[feature.icon] || feature.icon
    }));

    function onConnectionButtonClick() {
        push("/login");
    }

    function onInscriptionButtonClick() {
        push("/signup");
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

        try {
            const newUserResponse = await registerNewAccount(
                name,
                firstName,
                email,
                password,
                "",
                profileDescription
            );

            const createdUser = newUserResponse?.data;
            if (!createdUser || !createdUser.id) {
                errorMessage = "Erreur lors de la création du compte";
                return;
            }

            const loginSuccess = await authLogin(email, password).catch((error) => {
                errorMessage = error.message || "Échec de connexion";
                return false;
            });

            if (!loginSuccess) return;

            if (profilePictureFile) {
                try {
                    await uploadProfilePicture(createdUser.id, profilePictureFile);
                    console.log("Photo uploadée:");
                } catch (err) {
                    console.error("Échec de l'upload de la photo :", err);
                }
            }

            push("/feed");
        } catch (error: any) {
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: any) => {
                    fieldErrors[err.field] = err.message;
                });
                errorMessage = error.message || "Erreur de validation";
            } else {
                errorMessage = error.message || "Une erreur est survenue";
            }
        }
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

<header class="landing-page-header">
    <div class="landing-page-header-logo-container">
        <img alt="PawBook Logo" class="landing-page-header-logo" src={logo} />
        <h2 class="landing-page-header-logo-title">Pawbook</h2>
    </div>
    <div class="landing-page-header-buttons-container">
        {#if !isMobile()}
            <LanguageDropdown />
        {/if}
        <Button label={connectionLabel} onClick={onConnectionButtonClick}/>
        <Button label={inscriptionLabel} onClick={onInscriptionButtonClick} isCTA hadShadow/>
    </div>
</header>

<main class="landing-page">
    <div class="landing-page-background"></div>

    <section class="landing-page-content-section" style:flex-direction={heroDirection}>
        <div class="landing-page-content-hero-left-column">
            <div class="landing-page-content-hero-title-container">
                <h1 class="landing-page-content-hero-title">Partagez la vie de votre animal,<br />un moment à la fois</h1>
                <p class="landing-page-content-hero-subtitle">Parce que chaque animal mérite que l'on raconte son histoire. <br /><br />Parce que chaque instant mérite d'être conservé. <br /><br /> Partagez les moments précieux passés avec votre animal de compagnie et créez la communauté qui vous ressemble.</p>

                {#if !isMobile()}
                    <Button customClass={imageButtonClass} label="Rejoignez votre nouvelle communauté" onClick={onInscriptionButtonClick} isCTA hadShadow/>
                {/if}
            </div>
        </div>

        <div class="landing-page-content-hero-image-container">
            <img class="landing-page-content-hero-image" alt="Sitting woman in a field looking at her dog on her legs" src={heroImage} />

            {#if isMobile()}
                <Button customClass={imageButtonClass} label="Rejoignez votre nouvelle communauté" onClick={onInscriptionButtonClick} isCTA hadShadow/>
            {/if}
        </div>
    </section>

    <section class="landing-page-content-section" class:desktop-layout={!isMobile()} class:no-margin-top={isMobile()}>
        <h2 class="landing-page-content-section-title">Pourquoi rejoindre Pawbook ?</h2>
        <div class="landing-page-content-section-features-container" class:grid-layout={!isMobile()}>
            {#each featuresWithIcons as feature}
                <FeatureCard feature={feature}/>
            {/each}
        </div>
    </section>

    <section class="landing-page-content-section" class:desktop-layout={!isMobile()}>
        <h2 class="landing-page-content-section-title">Ce qu'ils en pensent</h2>
        <div class="landing-page-content-section-features-container" class:grid-layout={!isMobile()}>
            {#each opinionsData as opinion}
                <OpinionCard opinion={opinion}/>
            {/each}
        </div>
    </section>

    <section class="landing-page-content-section" class:desktop-layout={!isMobile()}>
        <h2 class="landing-page-content-section-title">Inscrivez-vous gratuitement</h2>

        <div class="landing-page-form-container">
            <form class="landing-page-form" action="/login" method="POST" onsubmit={onSubmit}>
                <div class="landing-page-form-picture-wrapper">
                    <div class="landing-page-form-picture-container">
                        <img src={profilePicturePreview ? profilePicturePreview : "/paws.png"} alt="User Avatar" class="landing-page-form-picture" />

                        <input type="file" id="profilePictureInput" class="landing-page-form-picture-input"
                               accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onchange={onProfilePictureChange} />
                        <label for="profilePictureInput" class="landing-page-form-picture-upload-button" >
                            <span class="landing-page-form-picture-upload-button-icon">
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
                <div class="landing-page-form-names-container">
                    <Input type={"text"} name={"firstName"} bind:value={firstName}
                           placeholder={firstNamePlaceholder}
                           customClass={"landing-page-form-names-container-fist-name"} />
                    <Input type={"text"} name={"lastName"} bind:value={name}
                           placeholder={lastNamePlaceholder}
                           customClass={"landing-page-form-names-container-last-name"} />
                </div>
                <textarea name={"profileDescription"} bind:value={profileDescription}
                          placeholder={bioPlaceholder} class="landing-page-form-profile-description"> </textarea>

                <div class="landing-page-form-gcu-container">
                    <Input type={"checkbox"} name={"gcu"} bind:checked={gcu}
                           customClass={"landing-page-form-input-no-margin"} placeholder={gcuLabel}/>
                </div>

                <div class="error-message">{errorMessage}</div>

                <Button label={createMyAccount} type="submit" customClass="extra-margin-top" isCTA/>
            </form>
        </div>
    </section>

    <footer class="landing-page-footer" class:desktop-layout={!isMobile()}>
        <a href="/gcu" use:link class="landing-page-footer-link">{gcuFoorterLabel}</a>
        <p class="landing-page-footer-content">© Pawbook 2024 - 2025</p>
        <p class="landing-page-footer-content">All rights reserved</p>
    </footer>
</main>

<style lang="scss">
    .landing-page {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100vh;
        padding: 70px 0 10px 0;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;

        &-header {
            position: fixed;
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: var(--main-background-color);
            border-bottom: 1px solid var(--second-highlight-color);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            width: 100%;
            height: 70px;
            top: 0;
            padding: 0 1rem;
            z-index: 10;

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

            &-buttons-container {
                display: flex;
                margin-left: auto;
                gap: 1rem;
            }
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

        &-content {
            &-hero {
                &-left-column {
                    display: flex;
                    flex-direction: column;

                    @media only screen and (min-width: 1200px) {
                        width: 50%;
                        overflow-y: auto;
                        overflow-x: hidden;
                        padding: 0 3rem 2rem 2rem;
                    }
                }

                &-title {
                    font-size: 4.5rem;
                    font-family: var(--title-font-family);
                    font-weight: bold;
                    margin: 0 0 3rem 0;
                    text-align: center;
                    line-height: 0.95;

                    @media only screen and (min-width: 1200px) {
                        margin: 1.5rem 0 7rem 0;
                    }

                    &-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        @media only screen and (min-width: 1200px) {
                            flex: 1;
                        }
                    }
                }

                &-subtitle {
                    width: 95%;
                    font-size: 1.2rem;
                    margin: 0;
                    padding: 0;
                    line-height: 1;

                    @media only screen and (min-width: 1200px) {
                        margin: 0 0 7rem 0;
                    }
                }

                &-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 0.5rem;
                    border: 1px solid var(--second-highlight-color);

                    @media only screen and (min-width: 1200px) {
                        border-radius: 0;
                        border: none;
                        border-left: 1px solid var(--second-highlight-color);
                        box-shadow: -8px 0 8px rgba(0, 0, 0, 0.4);
                    }

                    &-container {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 50%;

                        @media only screen and (min-width: 1200px) {
                            position: fixed;
                            right: 0;
                            top: 60px;
                            width: 50%;
                            height: calc(100vh - 60px);
                        }
                    }
                }
            }

            &-section {
                display: flex;
                flex-direction: column;
                width: 95%;
                gap: 2rem;
                margin-top: 5rem;

                &-features-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                }

                &-title {
                    font-family: var(--title-font-family);
                    font-size: 2.5rem;
                    margin: 0;
                    padding: 0;
                }
            }
        }

        &-form-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-self: center;
            border: 1px solid var(--second-highlight-color);
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

        &-footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 0.8rem;
            padding: 2rem 0 0.5rem 0;

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

    :global(.image-button) {
        background-color: #87B8CD !important;
        font-size: 1.15rem !important;
        height: 3.5rem !important;
    }

    @media only screen and (min-width: 1200px) {
        :global(.landing-page-content-hero-title-container .image-button) {
            position: static;
        }
    }

    @media only screen and (max-width: 1199px) {
        :global(.landing-page-content-hero-image-container .image-button) {
            position: absolute;
            bottom: 4rem;
        }
    }

    .desktop-layout {
        width: 50%;
        margin-right: auto;
        padding: 0 3rem 2rem 2rem;
    }

    .no-margin-top {
        margin-top: -2rem;
    }

    .grid-layout {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;

        :global(.feature-card),
        :global(.opinion-card) {
            width: calc(50% - 0.5rem);

            &:first-child {
                margin-top: 2rem;
            }
        }
    }
</style>