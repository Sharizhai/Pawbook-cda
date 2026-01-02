import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {PostReport, PostReportData} from "$domain/entities/PostReports";
import {Post} from "$domain/entities/Posts";

export class InMemoryPostReportRepository implements IPostReportRepository {
    private postReports: PostReport[] = [];
    private userRepository?: IUserRepository;
    private postRepository?: IPostRepository;

    setUserRepository(repo: IUserRepository): void {
        this.userRepository = repo;
    }

    setPostRepository(repo: IPostRepository): void {
        this.postRepository = repo;
    }

    async findAll(page: number, limit: number): Promise<PostReport[]> {
        const sorted = [...this.postReports].sort((a, b) => {
            const aSensitive = a.isSensitiveContent();
            const bSensitive = b.isSensitiveContent();

            if (aSensitive && !bSensitive) return -1;
            if (!aSensitive && bSensitive) return 1;

            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        const paginated = sorted.slice(page, page + limit);

        return await this.populatePosts(paginated);
    }

    async findById(id: string): Promise<PostReport | null> {
        const postReported = this.postReports.find(post => post.id === id);

        if (!postReported) return null;

        return postReported;
    }

    async findByReporterId(reporterId: string, page: number, limit: number): Promise<PostReport[]> {
        const filtered = this.postReports.filter(post => post.reporterId === reporterId);
        const sorted = filtered.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        const paginated = sorted.slice(page, page + limit);

        return paginated;
    }

    async findByPostAuthorId(postAuthorId: string, page: number, limit: number): Promise<PostReport[]> {
        if (!this.postRepository) {
            throw new Error("PostRepository not set");
        }

        const authorPosts = await this.postRepository.findByAuthorId(postAuthorId, page, limit);
        const authorPostIds = authorPosts.map(post => post.id);

        const filtered = this.postReports.filter(report =>
            authorPostIds.includes(report.postId)
        );

        const sorted = filtered.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        const paginated = sorted.slice(page, page + limit);

        return paginated;
    }

    async save(ReportPostData: PostReportData): Promise<PostReport> {
        if (this.postRepository) {
            const post = await this.postRepository.findById(ReportPostData.postId);
            if (post) {
                await this.postRepository.update(ReportPostData.postId, {
                    reportCount: post.reportCount + 1,
                    moderationStatus: "PENDING"
                });
            }
        }

        const postReported = new PostReport(ReportPostData);
        this.postReports.push(postReported);

        return Promise.resolve(postReported);
    }

    async update(id: string, ReportPostData: Partial<PostReportData>): Promise<PostReport  | null> {
        const index = this.postReports.findIndex(post => post.id === id);
        if (index === -1) return Promise.resolve(null);

        const existing = this.postReports[index];
        const updated = new PostReport({ ...existing, ...ReportPostData });
        this.postReports[index] = updated;

        return Promise.resolve(updated);
    }

    async clear(): Promise<void> {
        this.postReports.length = 0;
        return Promise.resolve();
    }

    private async populatePosts(postReports: PostReport[]): Promise<PostReport[]> {
        if (!this.postRepository) {
            return postReports;
        }

        return Promise.all(
            postReports.map(async (postReport) => {
                let populatedPost;

                if (postReport.postId) {
                    const post: Post = await this.postRepository!.findById(postReport.postId);
                    if (post) {
                        populatedPost = {
                            id: post.id,
                            authorId: post.authorId,
                            textContent: post.textContent,
                            photoContent: post.photoContent,
                            reportCount: post.reportCount,
                            moderationStatus: post.moderationStatus,
                            author: post.author
                        };
                    }
                }

                return new PostReport({
                    ...postReport,
                    post: populatedPost
                });
            })
        );
    }
}