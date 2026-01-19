<script lang="ts">
    import TableActionsButtons from "$components/generic/TableActionsButtons.svelte";
    import type { PostReportInformations } from "$types/postReportTypes";
    import * as messages from "$lib/paraglide/messages";
    import {formatDateTime} from "$utils/dateUtils";

    let { postReports } : { postReports: PostReportInformations[] } = $props();

    const postIdLabel = messages.post_moderation_table_post_id();
    const postTextContentLabel = messages.post_moderation_table_post_text_content();
    const postPhotoContentLabel = messages.post_moderation_table_post_photo_content();
    const postAuthorLabel = messages.post_moderation_table_post_author();
    const postReporterLabel = messages.post_moderation_table_post_reporter();
    const reportReasonLabel = messages.post_moderation_table_report_reason();
    const reportCommentLabel = messages.post_moderation_table_report_comment();
    const actionsLabel = messages.post_moderation_table_actions();

    function onValidateReportButtonClick(reportId: string) {

    }

    function onDeleteReportButtonClick(reportId: string) {

    }
</script>

<table>
    <thead>
        <tr>
            <th scope="col"></th>
            <th scope="col">{postIdLabel}</th>
            <th scope="col">{postTextContentLabel}</th>
            <th scope="col">{postPhotoContentLabel}</th>
            <th scope="col">{postAuthorLabel}</th>
            <th scope="col">{postReporterLabel}</th>
            <th scope="col">{reportReasonLabel}</th>
            <th scope="col">{reportCommentLabel}</th>
            <th scope="col">{actionsLabel}</th>
        </tr>
    </thead>

    <tbody>
        {#each postReports as report}
            <tr>
                <th scope="row">{formatDateTime(report.createdAt)}</th>
                <td>{report.post?.id || report.postId}</td>
                <td>{report.post?.textContent || ''}</td>
                <td>{report.post?.photoContent ? report.post.photoContent.join(', ') : ''}</td>
                <td>
                    <a class="author-button" href="#/profile/{report.post?.author?.id}">
                        {report.post?.author?.firstName} {report.post?.author?.name}
                    </a>
                </td>
                <td>
                    <a class="author-button" href="#/profile/{report.reporter?.id}">
                        {report.reporter?.firstName} {report.reporter?.name}
                    </a>
                </td>
                <td>{report.reason}</td>
                <td>{report.description || ''}</td>
                <td>
                    <TableActionsButtons onValidateClick={() => onValidateReportButtonClick(report.id)}
                                         onDeleteClick={() => onDeleteReportButtonClick(report.id)}/>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">
    table {
        border-collapse: collapse;
        font-size: 0.8rem;
    }

    th, td {
        border: 1px solid var(--main-highlight-color);
        padding: 0.3rem;
    }

    tbody > tr:nth-of-type(even) {
        background-color: color-mix(in srgb, var(--second-highlight-color) 20%, transparent);
    }
</style>