import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {UnlikeAPostUseCase} from "$application/use-cases/like/UnlikeAPostUseCase";
import {PostLikeDto} from "$presentation/dto/validation";
import {UnitPostLike} from "../../seeds/unit-post-like";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {Container} from "$types/container";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";

describe("Use case: ", () => {
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;
    let postLikeRepository: IPostLikeRepository;
    let unlikeAPostUseCase: UnlikeAPostUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        postLikeRepository = c.resolve<IPostLikeRepository>("postLikeRepository");

        unlikeAPostUseCase = new UnlikeAPostUseCase(postLikeRepository, userRepository, postRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);

        await postRepository.save(UnitPost.post1);
        await postRepository.save(UnitPost.post2);

        await postLikeRepository.save(UnitPostLike.johnPost1);
        await postLikeRepository.save(UnitPostLike.janePost1);
    })

    it("Should return an error if no post with this id is found", async () => {
        const nonExistantPostIdData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "nonExistantPostId"
        } as PostLikeDto;

        await expect(unlikeAPostUseCase.execute(nonExistantPostIdData)).rejects.toThrow("postId must be a valid UUID");
    });

    it("Should throw an error if no user with this id is found", async () => {
        const nonExistantUserIdData = {
            authorId: "nonExistantUserId",
            postId: "550e8400-e29b-41d4-a716-446655440100"
        } as PostLikeDto;

        await expect(unlikeAPostUseCase.execute(nonExistantUserIdData)).rejects.toThrow("userId must be a valid UUID");
    });

    it("Should throw an error if user is not liking the post", async () => {
        const nonFollowingUserTargetData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "550e8400-e29b-41d4-a716-446655440200"
        } as PostLikeDto;

        await expect(unlikeAPostUseCase.execute(nonFollowingUserTargetData)).rejects.toThrow("You don't like this post");
    });

    it("Should verify like relationship exists before unliking", async () => {
        const validData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "550e8400-e29b-41d4-a716-446655440100"
        } as PostLikeDto;

        const existsBefore = await postLikeRepository.exists(validData.authorId, validData.postId);
        expect(existsBefore).toEqual(true);

        await unlikeAPostUseCase.execute(validData);

        const existsAfter = await postLikeRepository.exists(validData.authorId, validData.postId);
        expect(existsAfter).toBe(false);
    });

    it("Should delete a like", async () => {
        const validData = {
            authorId: "550e8400-e29b-41d4-a716-446655440001",
            postId: "550e8400-e29b-41d4-a716-446655440100"
        } as PostLikeDto;

        const unlike = await unlikeAPostUseCase.execute(validData);

        expect(unlike).toBeDefined();
        expect(unlike.authorId).toBe("550e8400-e29b-41d4-a716-446655440001");
        expect(unlike.postId).toBe("550e8400-e29b-41d4-a716-446655440100");

        const likeExists = await postLikeRepository.exists(
            validData.authorId,
            validData.postId
        );

        expect(likeExists).toBe(false);
    });
})