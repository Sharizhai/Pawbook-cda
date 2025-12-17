<svelte:head>
  <title>Pawbook Profile</title>
</svelte:head>

<script lang="ts">
    import AnimalCreationDialogPanel from "$components/dialogPanels/AnimalCreationDialogPanel.svelte";
    import PostCreationDialogPanel from "$components/dialogPanels/PostCreationDialogPanel.svelte";
    import EmptyContentCTA from "$components/profile/EmptyContentCTA.svelte";
    import {fetchPostsByAuthorId} from "$services/postsServices.svelte";
    import {fetchAnimalsByOwnerId} from "$services/animalServices";
    import ProfileCard from "$components/profile/ProfileCard.svelte";
    import ProfileTabs from "$components/profile/ProfileTabs.svelte";
    import AnimalCard from "$components/profile/AnimalCard.svelte";
    import PostCard from "$components/post/PostCard.svelte";
    import Button from "$components/generic/Button.svelte";
    import Navbar from "$components/navbar/Navbar.svelte";
    import * as messages from "$lib/paraglide/messages";
    import {ProfileTab} from "$types/profileTabsTypes";
    import {profileTabs} from "$config/profileTabsUI";
    import { user } from "\$stores/stores.svelte";

    const emptyPostIncentive = messages.profile_tab_posts_incentive();
    const emptyPostButtonLabel = messages.profile_tab_first_post();
    const noPostLabel = messages.profile_tab_no_post();
    const noAnimalLabel = messages.profile_tab_no_animal();
    const emptyAnimalIncentive = messages.profile_tab_animals_incentive();
    const emptyAnimalButtonLabel = messages.profile_tab_first_animal();
    const addNewAnimalButtonLabel = messages.profile_tab_new_animal();
    const addNewPostButtonLabel = messages.profile_tab_new_post();

    let activeTab = $state(ProfileTab.Publications);

    let profilePosts = $state<any[]>([]);
    let profileAnimals = $state<any[]>([]);

    let hasNoPosts = $derived(profilePosts.length === 0);
    let hasAnimals = $derived(profileAnimals.length > 0);

    let profileUserId = $state<string | undefined>(undefined);
    let isOwnProfile = $derived(profileUserId !== undefined && profileUserId === user.information?.id);
    let profileUser = $derived(isOwnProfile ? user.information : null);

    let isPostCreationDialogPanelOpen = $state(false);
    let isAnimalCreationDialogPanelOpen = $state(false);

    const { params = {} }: { params?: { userId?: string } } = $props();

    $effect(() => {
        if (params.userId && user.information) {
            profileUserId = params.userId;
            loadProfileData();
        }
    });

    $effect(() => {
        if (isAnimalCreationDialogPanelOpen === false && profileUserId)
            loadProfileData();
    });

    function onHeaderTabButtonClick(tab: ProfileTab) {
        activeTab = tab;
    }

    function onCreateFirstPostButtonClick() {
        isPostCreationDialogPanelOpen = true;
    }

    function onCreateFirstAnimalButtonClick() {
        isAnimalCreationDialogPanelOpen = true;
    }

    async function loadProfileData() {
        if (!profileUserId) return;

        try {
            const [postsResult, animalsResult] = await Promise.all([
                fetchPostsByAuthorId(1, 10, profileUserId),
                fetchAnimalsByOwnerId(0, 10, profileUserId)
            ]);

            profilePosts = postsResult.posts || [];
            profileAnimals = animalsResult.animals || [];
        } catch (error) {
            console.error("Error loading profile:", error);
            profilePosts = [];
            profileAnimals = [];
        }
    }
</script>
    {#snippet profileTabContentSnippet()}
        {#if activeTab === ProfileTab.Publications}
            <div class="content-container">
                {#if hasNoPosts && isOwnProfile}
                    <EmptyContentCTA label={emptyPostButtonLabel} incentive={emptyPostIncentive} onClick={onCreateFirstPostButtonClick} />
                {:else if hasNoPosts && !isOwnProfile}
                    <p>{noPostLabel}</p>
                {:else}
                    {#if isOwnProfile}
                        <Button label={addNewPostButtonLabel} onClick={onCreateFirstPostButtonClick} isCTA />
                    {/if}

                    {#each profilePosts as post (post.id)}
                        <PostCard {post}/>
                    {/each}
                {/if}
            </div>

        {:else if activeTab === ProfileTab.Animals}
            <div class="content-container">
                {#if !hasAnimals && isOwnProfile}
                    <EmptyContentCTA label={emptyAnimalButtonLabel} incentive={emptyAnimalIncentive} onClick={onCreateFirstAnimalButtonClick} />
                {:else if !hasAnimals && !isOwnProfile}
                    <p>{noAnimalLabel}</p>
                {:else}
                    {#if isOwnProfile}
                        <Button label={addNewAnimalButtonLabel} onClick={onCreateFirstAnimalButtonClick} isCTA />
                    {/if}

                    {#each profileAnimals as animal (animal.id)}
                        <AnimalCard {animal}/>
                    {/each}
                {/if}
            </div>
        {/if}
    {/snippet}

    <main id="profile-page">
        <div class="profile-page-background"></div>

        <div class="profile-page-container">
            {#if profileUser}
                <ProfileCard firstName={profileUser.firstName} lastName={profileUser.name}
                             description={profileUser.profileDescription} profilePicture={profileUser.profilePicture} />
            {/if}

            <ProfileTabs onClick={onHeaderTabButtonClick} tabContent={profileTabContentSnippet} activeTab={activeTab} tabs={profileTabs} />
        </div>
        <Navbar />
    </main>

    <PostCreationDialogPanel bind:isVisible={isPostCreationDialogPanelOpen}/>
    <AnimalCreationDialogPanel bind:isVisible={isAnimalCreationDialogPanelOpen}/>

<style lang="scss">
    #profile-page {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 5px;
        width: 100%;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;

        @media only screen and (min-width: 1200px) {
          padding: 70px 5px 5px 5px;
        }
    }

    .profile-page {
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

        &-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            max-width: 40rem;
            margin-bottom: 80px;
            box-sizing: border-box;
        }
    }

    .content-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 1rem 0 0 0;

        :global(.button-default) {
            margin: 1rem 0 3rem 0;
        }
    }
</style>