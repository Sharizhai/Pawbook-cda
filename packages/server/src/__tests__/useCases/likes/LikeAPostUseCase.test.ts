import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {LikeAPostUseCase} from "$application/use-cases/like/LikeAPostUseCase";
import {PostLikeDto} from "$presentation/dto/validation";
import {UnitPostLike} from "../../seeds/unit-post-like";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";

describe("Use case: ", () => {
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;
    let postLikeRepository: IPostLikeRepository;
    let likeAPostUseCase: LikeAPostUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        postLikeRepository = c.resolve<IPostLikeRepository>("postLikeRepository");

        likeAPostUseCase = new LikeAPostUseCase(postLikeRepository, userRepository, postRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);

        await postRepository.save(UnitPost.post1);
        await postRepository.save(UnitPost.post2);

        await postLikeRepository.save(UnitPostLike.johnPost1);
    })

    it("Should return an error if no post with this id is found", async () => {
        const nonExistantPostIdData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "nonExistantPostId"
        } as PostLikeDto;

        await expect(likeAPostUseCase.execute(nonExistantPostIdData)).rejects.toThrow("postId must be a valid UUID");
    });

    it("Should throw an error if no user with this id is found", async () => {
        const nonExistantUserIdData = {
            authorId: "nonExistantUserId",
            postId: "550e8400-e29b-41d4-a716-446655440100"
        } as PostLikeDto;

        await expect(likeAPostUseCase.execute(nonExistantUserIdData)).rejects.toThrow("userId must be a valid UUID");
    });

    it("Should throw an error if user already like the post", async () => {
        const postAlreadyLikedData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "550e8400-e29b-41d4-a716-446655440100"
        } as PostLikeDto;

        await expect(likeAPostUseCase.execute(postAlreadyLikedData)).rejects.toThrow("You already liked this post");
    });

    it("Should create a like", async () => {
        const validPostLikedData = {
            authorId: "550e8400-e29b-41d4-a716-446655440000",
            postId: "550e8400-e29b-41d4-a716-446655440200"
        } as PostLikeDto;

        const postLike = await likeAPostUseCase.execute(validPostLikedData);

        expect(postLike).toBeDefined();
        expect(postLike.authorId).toBe(validPostLikedData.authorId);
        expect(postLike.postId).toBe(validPostLikedData.postId);
    });
})