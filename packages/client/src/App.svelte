<script lang="ts">
  import { isMobile } from "$utils/deviceUtils";
  import { app } from "$stores/stores.svelte";
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";

  // import PawCursor from 'src/components/PawCursor.svelte';

  import ForgottenPasswordPage from "$pages/ForgottenPasswordPage.svelte";
  import AccountCreationPage from "$pages/AccountCreationPage.svelte";
  import AdministrationPage from "$pages/AdministrationPage.svelte";
  import LandingPage from "$pages/LandingPage.svelte";
  import ProfilePage from "$pages/ProfilePage.svelte";
  import LoginPage from "$pages/LoginPage.svelte";
  import HomePage from "$pages/HomePage.svelte";
  import FeedPage from "$pages/FeedPage.svelte";
  import GcuPage from "$pages/GCUPage.svelte";

  const routes = {
    // "/": HomePage,
      "/": LandingPage,
    "/gcu": GcuPage,
    "/login": LoginPage,
    "/signup": AccountCreationPage,
    "/forgotten-password": ForgottenPasswordPage,
    "/feed": FeedPage,
    "/profile/:userId": ProfilePage,
      "/administration" : AdministrationPage
  };

  onMount(() => {
    app.activeLocale = localStorage.getItem("locale") ?? navigator.language.slice(0, 2);

    if (isMobile())
      document.body.classList.add("mobile");
  });

</script>

<Router {routes} />
<!-- <PawCursor /> -->