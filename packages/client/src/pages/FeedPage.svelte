<svelte:head>
  <title>Pawbook Feed</title>
</svelte:head>

<script lang="ts">
    import {fetchAllpostLikesByAuthorId} from "$services/likeServices";
    import {setupInfiniteScroll} from "$utils/infiniteScrollUtils";
    import {fetchAllPosts} from "$services/postsServices.svelte";
    import NavHeader from "$components/navbar/NavHeader.svelte";
    import PostCard from "$components/post/PostCard.svelte";
    import {like, post, user} from "$stores/stores.svelte";
    import Navbar from "$components/navbar/Navbar.svelte";
    import {onMount} from "svelte";

    let isLoading = $state(true);
    let error = $state<string | null>(null);

    onMount(() => {
        loadInitialPosts();
        getPostLikes();

        const cleanup = setupInfiniteScroll({threshold: 300, loadMorePosts: loadMorePosts });

        return cleanup;
    });

    async function loadInitialPosts() {
        isLoading = true;
        error = null;

        try {
            const result = await fetchAllPosts(1, 10);
            post.setPosts(result.posts);
            post.setHasMore(result.hasMore);
            post.setCurrentPage(1);
        } catch (e) {
            error = "Erreur lors du chargement des posts";
        } finally {
            isLoading = false;
        }
    }

    async function loadMorePosts() {
        if (isLoading || !post.hasMore) return;

        isLoading = true;

        try {
            const nextPage = post.currentPage + 1;
            const result = await fetchAllPosts(nextPage, 10);

            post.addPosts(result.posts);
            post.setHasMore(result.hasMore);
            post.setCurrentPage(nextPage);
        } catch (e) {
            console.error('Erreur:', e);
            error = "Erreur lors du chargement";
        } finally {
            isLoading = false;
        }
    }

    async function getPostLikes() {
        fetchAllpostLikesByAuthorId().then(likes => {
            like.setLikes(likes);
        });
    }
</script>

    <main id="feed-page-container">
        <div class="feed-page-background"></div>
        <NavHeader />

        <div class="feed-page-postcard-container">
            {#each post.posts as postItem (postItem.id)}
                <PostCard postData={postItem} />
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