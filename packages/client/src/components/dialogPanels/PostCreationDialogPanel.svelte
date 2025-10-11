<script lang="ts">
    import DialogPanelButton from "$components/generic/dialogPanel/DialogPanelButton.svelte";
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import uploadIcon from "$assets/icons/images/upload-image.svg?raw";
    import Scrollbar from "$components/generic/Scrollbar.svelte";
    import {ScrollbarOrientation} from "$types/scrollbarTypes";
    import {isStringNotValid} from "$utils/stringUtils";
    import * as messages from "$lib/paraglide/messages";
    import type {Snippet} from "svelte";
    import Thumbnail from "$components/images/Thumbnail.svelte";

    const panelTitle = messages.post_creation_dialog_panel_title();
    const addPhotoLabel = messages.post_creation_dialog_panel_photo_button();
    const limitReachedLabel = messages.post_creation_dialog_panel_photo_button_limit();
    const filesLimitWarning = messages.post_creation_dialog_panel_too_many_files();
    const unauthorizedFilesWarning = messages.post_creation_dialog_panel_unauthorized_files();
    const publishLabel = messages.post_creation_dialog_panel_publish();

    const panelContent: Snippet[] = [contentSnippet];
    let commentInputValue: string = $state("");
    let errorMessage: string = $state("");
    const maxImagesAuthorized: number = 10;

    let selectedImages: Array<{id: string, file: File, preview: string}> = $state([]);

    let { isVisible = $bindable() } : { isVisible: boolean } = $props();

    function onPublishButtonClick() {
        if(isStringNotValid(commentInputValue)) return;

        // TODO :
        // handle real upload
    }

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (!files) return;

        errorMessage = "";

        const allowedImageTypes = [ "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp"
        ];

        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];


        if (selectedImages.length + files.length > maxImagesAuthorized) {
            errorMessage = filesLimitWarning;
            input.value = "";
            return;
        }

        Array.from(files).forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImage = {
                        id: Date.now() + Math.random().toString(),
                        file: file,
                        preview: e.target?.result as string
                    };
                    selectedImages = [...selectedImages, newImage];
                };
                reader.readAsDataURL(file);
            }
        });

        input.value = '';
    }

    function onRemoveImageButtonClick(imageId: string) {
        selectedImages = selectedImages.filter(img => img.id !== imageId);
    }

    function getGridClass(imageCount: number): string {
        if (imageCount === 1) return 'grid-cols-1';
        if (imageCount === 2) return 'grid-cols-2';
        return 'grid-cols-3';
    }
</script>

{#snippet contentSnippet()}
    <textarea class="post-creation-dialog-panel-text-area" rows="7" bind:value={commentInputValue}>
    </textarea>

    <input
            class="post-creation-dialog-panel-input-file"
            type="file"
            id="input-file"
            name="input-file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onchange={handleFileChange}
            disabled={selectedImages.length >= maxImagesAuthorized}
    />
    <label for="input-file" class:disabled={selectedImages.length >= maxImagesAuthorized}>
        <span class="input-file-icon">{@html uploadIcon}</span>
        {selectedImages.length >= maxImagesAuthorized ? `${limitReachedLabel} (10/10)` : `${addPhotoLabel} (${selectedImages.length}/10)`}
    </label>

    {#if selectedImages.length > 0}
        <div class="images-grid-wrapper">
            <Scrollbar orientation={ScrollbarOrientation.Vertical}>
                <div class="images-grid {getGridClass(selectedImages.length)}">
                    {#each selectedImages as image (image.id)}
                        <Thumbnail image={image} onRemoveClick={onRemoveImageButtonClick} />
                    {/each}
                </div>
            </Scrollbar>
        </div>
    {/if}

    <DialogPanelButton onClick={onPublishButtonClick} label={publishLabel} isCTA isDisabled={selectedImages.length === 0 && isStringNotValid(commentInputValue)} />
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent} />

<style lang="scss">
    .post-creation-dialog-panel {
        &-text-area {
            margin: 1.5rem 0 1.2rem 0;
            padding: 0.5rem;
            width: 100%;
            background-color: rgba(var(--main-background-color), 0.9);
            border: 1px solid rgba(30, 138, 182, 0.4);
            border-radius: 0.375rem;
            color: var(--main-text-color);
            resize: none;

            &:focus {
                border: 1px solid rgba(30, 138, 182, 0.4);
                outline: none;
            }
        }

        &-input-file {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;

            &:disabled + label {
                opacity: 0.6;
                cursor: not-allowed;
                border-color: rgba(30, 138, 182, 0.2);
            }
        }
    }

    .post-creation-dialog-panel-input-file + label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
        cursor: pointer;
        margin: 0 0 1rem 0;
        min-width: 10.625rem;
        width: 100%;
        height: 2.5rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(30, 138, 182, 0.4);
        background-color: var(--main-background-color);
        color: var(--main-text-color);
        font-size: 1rem;
        font-weight: bold;
        padding: 0.625rem 1.25rem;
        text-align: center;
        text-decoration: none;

        &.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            border-color: rgba(30, 138, 182, 0.2);
        }
    }

    .post-creation-dialog-panel-input-file:focus + label:not(.disabled),
    .post-creation-dialog-panel-input-file + label:hover:not(.disabled) {
        border: 1px solid var(--main-text-color);
    }

    .input-file-icon :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0.3rem 0.5rem 0 0;
        color: var(--main-text-color);
    }

    .images-grid {
        display: grid;
        gap: 0.5rem;
        width: 100%;
        max-height: 15.5rem;

        &.grid-cols-1 {
            grid-template-columns: 1fr;
        }

        &.grid-cols-2 {
            grid-template-columns: 1fr 1fr;
        }

        &.grid-cols-3 {
            grid-template-columns: 1fr 1fr 1fr;
        }

        &-wrapper {
            padding: 0 0 1rem 0;
        }
    }

</style>