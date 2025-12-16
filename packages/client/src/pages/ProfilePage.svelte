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
    const emptyAnimalIncentive = messages.profile_tab_animals_incentive();
    const emptyAnimalButtonLabel = messages.profile_tab_first_animal();
    const addNewAnimalButtonLabel = messages.profile_tab_new_animal();

    let activeTab = $state(ProfileTab.Publications);

    let isOwnProfile = $state(false);
    let profilePosts = $state<any[]>([]);
    let profileAnimals = $state<any[]>([]);
    let hasNoPosts = $state(true);
    let hasNoAnimals = $state(true);
    let hasAnimals = $derived(profileAnimals.length > 0);

    let isPostCreationDialogPanelOpen = $state(false);
    let isAnimalCreationDialogPanelOpen = $state(false);

    const { params = {} }: { params?: { userId?: string } } = $props();

    $effect(() => {
        if (params.userId && user.information) {
            loadProfileData();
        }
    });

    $effect(() => {
        if (isAnimalCreationDialogPanelOpen === false)
            loadProfileData()
    })

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
        const userId = params.userId;

        if (!userId) {
            return;
        }

        isOwnProfile = userId === user.information?.id;

        try {
            const result = await fetchPostsByAuthorId(0, 10, userId);

            profilePosts = result.posts || [];
            hasNoPosts = profilePosts.length === 0;

            const animalsResult = await fetchAnimalsByOwnerId(0, 10, userId);
            profileAnimals = animalsResult.animals || [];
            hasNoAnimals = profileAnimals.length === 0;
        } catch (error) {
            console.error("Error loading profile:", error);
            profilePosts = [];
            hasNoPosts = true;
            profileAnimals = [];
            hasNoAnimals = true;
        }
    }
</script>
    {#snippet profileTabContentSnippet()}
        {#if activeTab === ProfileTab.Publications}
            <div class="content-container">
                {#if hasNoPosts && isOwnProfile}
                    <EmptyContentCTA label={emptyPostButtonLabel} incentive={emptyPostIncentive} onClick={onCreateFirstPostButtonClick}/>
                {:else if hasNoPosts && !isOwnProfile}
                    <p>{noPostLabel}</p>
                {:else}
                    {#each profilePosts as post (post.id)}
                        <PostCard {post}/>
                    {/each}
                {/if}
            </div>

        {:else if activeTab === ProfileTab.Animals}
            <div class="content-container">
                {#if !hasAnimals}
                    <EmptyContentCTA label={emptyAnimalButtonLabel} incentive={emptyAnimalIncentive} onClick={onCreateFirstAnimalButtonClick}/>

                {:else}
                    <Button label={addNewAnimalButtonLabel} onClick={onCreateFirstAnimalButtonClick} isCTA/>

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
            <ProfileCard firstName={user.information?.firstName} lastName={user.information?.name} description={user.information?.profileDescription} profilePicture={user.information?.profilePicture}/>
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
        gap: 1rem;
    }
</style>