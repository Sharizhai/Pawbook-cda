<script lang="ts">
    import DialogPanelButton from "$components/generic/dialogPanel/DialogPanelButton.svelte";
    import DialogPanel from "$components/generic/dialogPanel/DialogPanel.svelte";
    import Dropdown from "$components/generic/Dropdown.svelte";
    import * as messages from "$lib/paraglide/messages";
    import type {Snippet} from "svelte";
    import {PostReportReason} from "$types/postReportTypes";
    import type {DropdownOptions} from "$types/dropdownTypes";
    import {report_dialog_panel_post_submit} from "$lib/paraglide/messages";

    const panelTitle = messages.report_dialog_panel_post_title();
    const dropdownTitleLabel = messages.report_dialog_panel_post_reason();
    const commentTitleLabel = messages.report_dialog_panel_post_comment();
    const reportButtonLabel = messages.report_dialog_panel_post_submit();

    let { isVisible = $bindable(), onReportClick } : { isVisible: boolean, onReportClick: (reason: PostReportReason, description?: string) => void } = $props();

    let selectedDropdownValue: string = $state("");
    let commentInputValue: string = $state("");

    const panelContent: Snippet[] = [contentSnippet];

    export const postReportOptions: DropdownOptions[] = [
        { value: PostReportReason.spam, label: messages.report_dialog_panel_post_reason_spam() },
        { value: PostReportReason.harassment, label: messages.report_dialog_panel_post_reason_harassment() },
        { value: PostReportReason.hateSpeech, label: messages.report_dialog_panel_post_reason_hate_speech() },
        { value: PostReportReason.violence, label: messages.report_dialog_panel_post_reason_violence() },
        { value: PostReportReason.inappropriate, label: messages.report_dialog_panel_post_reason_inappropriate() },
        { value: PostReportReason.sexualContent, label: messages.report_dialog_panel_post_reason_sexual_content() },
        { value: PostReportReason.falseInformation, label: messages.report_dialog_panel_post_reason_false_information() },
        { value: PostReportReason.copyright, label: messages.report_dialog_panel_post_reason_copyright() },
        { value: PostReportReason.animalAbuse, label: messages.report_dialog_panel_post_reason_animal_abuse() },
        { value: PostReportReason.selfHarm, label: messages.report_dialog_panel_post_reason_self_harm() },
        { value: PostReportReason.other, label: messages.report_dialog_panel_post_reason_other() }
    ];

    function onReportButtonClick() {
        const description = commentInputValue.trim() !== "" ? commentInputValue : undefined;

        onReportClick(selectedDropdownValue as PostReportReason, description);
    }
</script>

{#snippet contentSnippet()}
    <div class="report-dialog-panel-container">
        <Dropdown title={dropdownTitleLabel} options={postReportOptions} bind:value={selectedDropdownValue}/>

        <div class="report-dialog-panel-container-comment">
            <h3 class="report-dialog-panel-container-comment-title">{commentTitleLabel}</h3>
            <textarea class="report-dialog-panel-container-comment-text-area" rows="7" bind:value={commentInputValue}></textarea>
        </div>

        <DialogPanelButton label={reportButtonLabel} onClick={onReportButtonClick} isDisabled={selectedDropdownValue === ""} isCTA/>
    </div>
{/snippet}

<DialogPanel bind:isVisible title={panelTitle} steps={panelContent} />

<style lang="scss">
    .report-dialog-panel-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 1.5rem 1rem 1rem 1rem;
        gap: 1rem;

        &-comment {
            width: 100%;

            &-title {
                font-size: 1rem;
                color: var(--main-text-color);
                font-weight: bold;
                padding: 0;
                margin: 0 0 0.2rem 0;
            }

            &-text-area {
                padding: 0.5rem;
                width: 100%;
                background-color: rgba(var(--main-background-color), 0.9);
                border: 1px solid rgba(30, 138, 182, 0.4);
                border-radius: 0.375rem;
                color: var(--main-text-color);
                resize: none;

                &:focus {
                    border: 1px solid var(--second-highlight-color);
                    outline: none;
                }
            }
        }

        :global(.dialog-panel-button) {
            margin: 1rem 0 0 0;
        }
    }
</style>