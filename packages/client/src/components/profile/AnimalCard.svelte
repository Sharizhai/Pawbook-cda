<script lang="ts">
    import SettingsButton from "$components/generic/SettingsButton.svelte";
    import LikeButton from "$components/post/LikeButton.svelte";
    import type {AnimalInformations} from "$types/animalTypes";

    let {
        animal
    } : {
        animal: AnimalInformations
    } = $props();

    function getAnimalInfo() {
        const parts = [ animal.type, animal.race, animal.age != null ? `${animal.age} ans` : null ];
        return parts.filter(Boolean).join(', ');
    }

    function onSettingsButtonClick() {
        console.log("Settings button clicked!");
    }

    function onLikeButtonClick() {
        console.log("Like button clicked!");
    }
</script>
<div class="animal-card-container">
    <SettingsButton onClick={onSettingsButtonClick} customClass="animal-card-settings-button" />
    <div class="animal-card-container-infos">
        <div class="animal-card-container-infos-avatar-container">
            <img src={animal.picture ? animal.picture : "/paws.png"} alt="Animal avatar" class="animal-card-container-infos-avatar" />
        </div>

        <div class="animal-card-container-infos-container">
            <div class="animal-card-container-infos-container-name">{animal.name}</div>
            <div class="animal-card-container-infos-container-infos">{getAnimalInfo()}</div>
            <div class="animal-card-container-infos-container-description">{animal.description}</div>
        </div>
    </div>

    <div class="animal-card-container-like-button-container">
        <LikeButton onClick={onLikeButtonClick} likeCount={animal.likes.length}/>
    </div>
</div>
<style lang="scss">
    .animal-card-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: var(--main-background-color);
        border-radius: 1rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-bottom: 1rem;
        padding: 1.5rem 0.625rem;

        &-infos {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;

            &-avatar-container {
                flex-shrink: 0;
                width: 8rem;
                height: 8rem;
                border-radius: 50%;
                margin-right: 1rem;
                border: 1px solid rgba(30, 138, 182, 0.4);
                overflow: hidden;
            }

            &-avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            &-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;

                &-name {
                    font-size: 1rem;
                    font-weight: bold;
                }

                &-infos {
                    font-size: 0.9rem;
                    font-weight: bold;
                    color: var(--second-text-color);
                    margin-bottom: 1rem;
                }

                &-description {
                    font-size: 0.85rem;
                    color: var(--second-text-color);
                }
            }
        }

        &-like-button-container {
            position: absolute;
            bottom: 0.5rem;
            right: 0.2rem;
        }
    }

    :global(.animal-card-settings-button) {
        position: absolute;
        top: 0.5rem;
        right: 0.2rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
</style>