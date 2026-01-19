<svelte:head>
    <title>Pawbook Administration</title>
</svelte:head>

<script lang="ts">
    import AdminNavbar from "$components/navbar/AdminNavbar.svelte";
    import NavHeader from "$components/navbar/NavHeader.svelte";
    import PostModerationTable from "$components/moderation/PostModerationTable.svelte";
    import { onMount } from "svelte";
    import { fetchAllPostReports } from "$services/reports/postReportsServices.svelte";
    import { postReport } from "$stores/stores.svelte";

    onMount(async () => {
        const { postReports, hasMore } = await fetchAllPostReports();
        postReport.setPostReports(postReports);
        postReport.setHasMore(hasMore);

        console.log(postReports);
    });
</script>

<main id="administration-page">
    <div class="administration-page-background"></div>
    <NavHeader />

    <div class="administration-page-container">
        <PostModerationTable postReports={postReport.postReports} />
    </div>

    <AdminNavbar />
</main>

<style lang="scss">
    #administration-page {
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

    .administration-page {
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
</style>