import {GetAllPostLikesByAuthorUseCase} from "$application/use-cases/like/GetAllPostLikesByAuthorUseCase";
import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {UnitPostLike} from "../../seeds/unit-post-like";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {PostLike} from "$domain/entities/PostLike";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";

describe("Use case: We must be able to get all post likes with an author id", () => {
    let userRepository: IUserRepository;
    let postLikeRepository: IPostLikeRepository;
    let postRepository: IPostRepository;
    let getAllPostLikesByAuthorUseCase: GetAllPostLikesByAuthorUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        postLikeRepository = c.resolve<IPostLikeRepository>("postLikeRepository");

        getAllPostLikesByAuthorUseCase = new GetAllPostLikesByAuthorUseCase(postLikeRepository, userRepository, postRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
        await userRepository.save(UnitUser.loly);

        await postRepository.save(UnitPost.post1);

        await postLikeRepository.save(UnitPostLike.johnPost1);
        await postLikeRepository.save(UnitPostLike.janePost1);
    })

    it("Should throw an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(getAllPostLikesByAuthorUseCase.execute(nonExistentUserId)).rejects.toThrow("User not found");
    });

    it("Should return an empty array if the user has no likes", async () => {
        const result = await getAllPostLikesByAuthorUseCase.execute(UnitUser.loly.id);

        expect(result).toHaveLength(0);
    });

    it("Should return an array of likes if some are found", async () => {
        const result = await getAllPostLikesByAuthorUseCase.execute(UnitUser.john.id);

        expect(result).toHaveLength(1);
        expect(result[0].authorId).toBe(UnitUser.john.id);
        expect(result[0].postId).toBe(UnitPost.post1.id);
    });

    it("Should only return likes belonging to the requested author", async () => {
        const result = await getAllPostLikesByAuthorUseCase.execute(UnitUser.john.id);

        expect(result).toHaveLength(1);
        expect(result.every((like: PostLike) => like.authorId === UnitUser.john.id)).toBe(true);
    });
})