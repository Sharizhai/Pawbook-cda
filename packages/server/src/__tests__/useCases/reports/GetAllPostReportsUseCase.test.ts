import {InMemoryPostReportRepository} from "$infrastructure/repositories/postReport/inMemoryPostReportRepository";
import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";
import {GetAllPostReportsUseCase} from "$application/use-cases/report/GetAllPostReportsUseCase";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {beforeEach, describe, it, expect, afterEach} from "vitest";
import {unitPostReport} from "../../seeds/unit-post-report";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";

describe("Use case: We must be able to get all post reports", () => {
    let postReportRepository: IPostReportRepository;
    let postRepository: IPostRepository;
    let userRepository: IUserRepository;
    let getAllPostReportsUseCase: GetAllPostReportsUseCase;

    beforeEach(async () => {
        const c: Container = container;
        postReportRepository = c.resolve<IPostReportRepository>("postReportRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        userRepository = c.resolve<IUserRepository>("userRepository");

        if (postRepository instanceof InMemoryPostRepository) {
            postRepository.setUserRepository(userRepository);
        }

        if (postReportRepository instanceof InMemoryPostReportRepository) {
            postReportRepository.setPostRepository(postRepository);
            postReportRepository.setUserRepository(userRepository);
        }

        getAllPostReportsUseCase = new GetAllPostReportsUseCase(postReportRepository);

        await postRepository.save(UnitPost.post1);
        await postRepository.save(UnitPost.post2);
        await postRepository.save(UnitPost.post3);
        await postRepository.save(UnitPost.post4);
        await postRepository.save(UnitPost.post5);

        await postReportRepository.save(unitPostReport.postreport1);
        await postReportRepository.save(unitPostReport.postreport2);
        await postReportRepository.save(unitPostReport.postreport3);
        await postReportRepository.save(unitPostReport.postreport4);
        await postReportRepository.save(unitPostReport.postreport5);

        await userRepository.save(UnitUser.john);
    })

    afterEach(async () => {
        await userRepository.delete(UnitUser.john.id);
        await postRepository.delete(UnitPost.post1.id);
        await postRepository.delete(UnitPost.post2.id);
        await postRepository.delete(UnitPost.post3.id);
        await postRepository.delete(UnitPost.post4.id);
        await postRepository.delete(UnitPost.post5.id);
        await (postReportRepository as InMemoryPostReportRepository).clear();
    });

    it("should return post reports with populated post data", async () => {
        const postReports = await getAllPostReportsUseCase.execute(0, 10);

        expect(postReports.postReports).toHaveLength(5);

        const returnedReport = postReports.postReports[0];

        expect(returnedReport.postId).toBeDefined();
        expect(returnedReport.postId).toBe(UnitPost.post4.id);

        expect(returnedReport.post).toBeDefined();
        expect(returnedReport.post.id).toBe(UnitPost.post4.id);
        expect(returnedReport.post.authorId).toBe(UnitUser.john.id);
        expect(returnedReport.post.textContent).toBe(UnitPost.post4.textContent);

        expect(returnedReport.post.author).toBeDefined();
        expect(returnedReport.post.author.id).toBe(UnitUser.john.id);
        expect(returnedReport.post.author.name).toBe(UnitUser.john.name);
        expect(returnedReport.post.author.firstName).toBe(UnitUser.john.firstName);
    });

    it("should return post reports sorted by oldest sensitive first then oldest first", async () => {
        const postReports = await getAllPostReportsUseCase.execute(0, 10);

        expect(postReports.postReports).toHaveLength(5);
        expect(postReports.postReports[0].id).toBe(unitPostReport.postreport4.id);
        expect(postReports.postReports[1].id).toBe(unitPostReport.postreport1.id);
        expect(postReports.postReports[2].id).toBe(unitPostReport.postreport2.id);
    });

    it("should return an array of post reports if some are found", async () => {
        const postReports = await getAllPostReportsUseCase.execute(0, 10);

        expect(postReports.postReports).toHaveLength(5);
        expect(postReports.postReports[0].description).toBe("So much cruelty !");
        expect(postReports.postReports[1].description).toBe("This post is spam and should be removed");
    });

    it("should paginate post reports with a specified limit", async () => {
        const page1 = await getAllPostReportsUseCase.execute(0, 2);
        expect(page1.postReports).toHaveLength(2);
        expect(page1.postReports[0].id).toBe("550e8400-e29b-41d4-a716-446655444000");
        expect(page1.postReports[1].id).toBe("550e8400-e29b-41d4-a716-446655441000");

        const page2 = await getAllPostReportsUseCase.execute(2, 2);
        expect(page2.postReports).toHaveLength(2);
        expect(page2.postReports[0].id).toBe("550e8400-e29b-41d4-a716-446655442000");
        expect(page2.postReports[1].id).toBe("550e8400-e29b-41d4-a716-446655443000");

        const page3 = await getAllPostReportsUseCase.execute(4, 2);
        expect(page3.postReports).toHaveLength(1);
        expect(page3.postReports[0].id).toBe("550e8400-e29b-41d4-a716-446655445000");
    });

    it("should return hasMore: true when more post reports exist", async () => {
        const result = await getAllPostReportsUseCase.execute(0, 2);

        expect(result.hasMore).toBe(true);
        expect(result.postReports).toHaveLength(2);
    });

    it("should return hasMore: false when no more post reports exist", async () => {
        const result = await getAllPostReportsUseCase.execute(0, 10);

        expect(result.hasMore).toBe(false);
        expect(result.postReports).toHaveLength(5);
    });
})