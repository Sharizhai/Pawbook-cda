import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {PostReport} from "$domain/entities/PostReports";

export class GetAllPostReportsUseCase {
    constructor(
        private readonly postReportRepository: IPostReportRepository
    ) {}

    async execute(page: number, limit: number): Promise<{postReports: PostReport[], hasMore: boolean}> {
        const postReports = await this.postReportRepository.findAll(page, limit + 1);

        const hasMore = postReports.length > limit;
        const postReportsToReturn = hasMore ? postReports.slice(0, limit) : postReports;

        return { postReports: postReportsToReturn, hasMore };
    }
}