import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {PostReportCreationDto} from "$presentation/dto/validation";
import {beforeEach, afterEach, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";
import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {InMemoryPostReportRepository} from "$infrastructure/repositories/postReport/inMemoryPostReportRepository";
import {CreateAPostReportUseCase} from "$application/use-cases/report/CreateAPostReportUseCase";

describe("Use case: We should be able to report a post", () => {
    let createAPostReportUseCase: CreateAPostReportUseCase;
    let postReportRepository: IPostReportRepository;
    let postRepository: IPostRepository;
    let userRepository: IUserRepository;
    let validPostReportData: PostReportCreationDto;

    beforeEach(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        postReportRepository = c.resolve<IPostReportRepository>("postReportRepository");

        if (postReportRepository instanceof InMemoryPostReportRepository) {
            postReportRepository.setPostRepository(postRepository);
        }

        createAPostReportUseCase = new CreateAPostReportUseCase(postReportRepository, postRepository, userRepository);

        await userRepository.save(UnitUser.jane);

        await postRepository.save(UnitPost.post1);

        validPostReportData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "SPAM",
            description: "",
        } as PostReportCreationDto;
    })

    afterEach(async () => {
        await userRepository.delete(UnitUser.jane.id);
        await postRepository.delete(UnitPost.post1.id);
        await (postReportRepository as InMemoryPostReportRepository).clear();
    });

    it("Should return an error if no post with this id is found", async () => {
        const invalidPostIdData = {
            postId: "550e8400-e29b-41d4-a716-446655440200",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "SPAM",
            description: "",
        } as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(invalidPostIdData)).rejects.toThrow("Post not found");
    });

    it("Should throw an error if post id is missing", async () => {
        const missingPostIdData = {
            postId: "",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "SPAM",
            description: "",
        } as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(missingPostIdData)).rejects.toThrow("postId must be a valid UUID");
    });

    it("Should return an error if no reporter with this id is found", async () => {
        const invalidReporterIdData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "550e8400-e29b-41d4-a716-446655440002",
            reason: "SPAM",
            description: "",
        } as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(invalidReporterIdData)).rejects.toThrow("User not found");
    });

    it("Should throw an error if reporter id is missing", async () => {
        const missingReporterIdData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "",
            reason: "SPAM",
            description: "",
        } as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(missingReporterIdData)).rejects.toThrow("reporterId must be a valid UUID");
    });

    it("Should throw an error if reason is missing", async () => {
        const missingReasonData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "",
            description: "",
        } as unknown as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(missingReasonData)).rejects.toThrow("Report reason not found");
    });

    it("Should throw an error if description exceeds max length", async () => {
        const descriptionTooLongData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "SPAM",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor felis, rhoncus eu interdum id, aliquam et mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer maximus elit non pulvinar interdum. Donec quis urna dignissim, viverra purus nec, tincidunt ex. Suspendisse eget efficitur nibh, in blandit neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus mauris nisl, luctus eget metus.",
        } as PostReportCreationDto;

        await expect(createAPostReportUseCase.execute(descriptionTooLongData)).rejects.toThrow("Report description is too long");
    });

    it("Should create a report without description", async () => {
        const result = await createAPostReportUseCase.execute(validPostReportData);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('postId', validPostReportData.postId);
        expect(result).toHaveProperty('reporterId', validPostReportData.reporterId);
        expect(result).toHaveProperty('reason', validPostReportData.reason);
        expect(result.description).toBe("");
        expect(result).toHaveProperty('createdAt');
    });

    it("Should create a report with description", async () => {
        const validData = {
            postId: "550e8400-e29b-41d4-a716-446655440100",
            reporterId: "550e8400-e29b-41d4-a716-446655440001",
            reason: "SPAM",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        } as PostReportCreationDto;

        const result = await createAPostReportUseCase.execute(validData);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('postId', validData.postId);
        expect(result).toHaveProperty('reporterId', validData.reporterId);
        expect(result).toHaveProperty('reason', validData.reason);
        expect(result).toHaveProperty('description', validData.description);
        expect(result).toHaveProperty('createdAt');
    });

    it("Should change the reported post moderationStatus as 'PENDING' & increment the reportCount +1", async () => {
        await createAPostReportUseCase.execute(validPostReportData);

        const updatedPost = await postRepository.findById(validPostReportData.postId);

        expect(updatedPost).toBeDefined();
        expect(updatedPost?.moderationStatus).toBe('PENDING');
        expect(updatedPost?.reportCount).toBe(1);
    });
})