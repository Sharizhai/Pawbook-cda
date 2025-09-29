<script lang="ts">
    import { timeElapsed } from "$utils/dateUtils";

    let { 
        profilePicture, 
        firstName, 
        lastName, 
        postCreationDate 
    } : { 
        profilePicture?: string, 
        firstName: string, 
        lastName: string,
        postCreationDate: Date
    } = $props();

    let formattedDate = $derived(postCreationDate ? timeElapsed(new Date(postCreationDate)) : '');
</script>
    
    <div class="postcard-user-infos-container">
        <img src={profilePicture ? profilePicture : "/paws.png"} alt="User Avatar" class="postcard-user-avatar" />
        <div class="postcard-user-name-container">
            <div class="postcard-user-name">{firstName} {lastName}</div>
            <div class="postcard-user-post-date">{formattedDate}</div>
        </div>   
    </div>

<style lang="scss">
    .postcard-user-infos-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
    }

    .postcard-user {
        &-avatar{
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;
            margin-right: 0.5rem;
            border: 1px solid rgba(30, 138, 182, 0.4);
        }

        &-name {
            font-size: 0.9rem;
            font-weight: bold;
            color: var(--main-text-color);
        }

        &-post-date {
            font-size: 0.8rem;
            color: var(--second-text-color);
        }
    }
</style>