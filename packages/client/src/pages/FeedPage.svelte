<svelte:head>
  <title>Pawbook Feed</title>
</svelte:head>

<script lang="ts">
    import {fetchAllPosts} from "$services/postsServices.svelte";
    import NavHeader from "$components/navbar/NavHeader.svelte";
    import PostCard from "$components/post/PostCard.svelte";
    import type {PostInformations} from "$types/postTypes";
    import Navbar from "$components/navbar/Navbar.svelte";
    import {onMount} from "svelte";

    let posts: PostInformations[] = $state([] as PostInformations[]);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        onLoad();
    });

    async function onLoad() {
        posts = await fetchAllPosts();
    }
</script>

    <main id="feed-page-container">
        <div class="feed-page-background"></div>
        <NavHeader />

        <div class="feed-page-postcard-container">
            {#each posts as post (post.id)}
                <PostCard {post} />
            {/each}
        </div>

        <Navbar />
    </main>

<style lang="scss">
    #feed-page-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100vh;
        padding: 70px 5px 0 5px;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .feed-page {
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

        &-postcard-container {
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
</style>