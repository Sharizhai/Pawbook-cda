import {beforeAll, describe, expect, it} from "vitest";

import {GetAllPostsByAuthorIdUseCase} from "$application/use-cases/post/GetAllPostsByAuthorIdUseCase";
import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";

import container from "$config/dependencyInjection";
import {Container} from "$types/container";

import {UnitPost} from "../../seeds/unit-post";
import {UnitUser} from "../../seeds/unit-user";

describe("Usecase: We must be able to get all posts with an author id", () => {
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;
    let getAllPostsByAuthorIdUseCase: GetAllPostsByAuthorIdUseCase;

    beforeAll( async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");

        if (postRepository instanceof InMemoryPostRepository) {
            postRepository.setUserRepository(userRepository);
        }

        getAllPostsByAuthorIdUseCase = new GetAllPostsByAuthorIdUseCase(postRepository, userRepository);

        await postRepository.save(UnitPost.post1);
        await postRepository.save(UnitPost.post2);
        await postRepository.save(UnitPost.post3);
        await postRepository.save(UnitPost.post4);
        await postRepository.save(UnitPost.post5);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
    })

    it("Should return an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(getAllPostsByAuthorIdUseCase.execute(0, 10, nonExistentUserId)).rejects.toThrow();
    });

    it("Should return an array of posts if some are found", async () => {
        const posts = await getAllPostsByAuthorIdUseCase.execute(0, 10, UnitUser.john.id);

        expect(posts.posts).toBeDefined();
        expect(posts.posts).toHaveLength(5);
    });

    it("Should return posts sorted by newest first", async () => {
        const posts = await getAllPostsByAuthorIdUseCase.execute(0, 10, UnitUser.john.id);

        expect(posts.posts).toHaveLength(5);
        expect(posts.posts[0].id).toBe(UnitPost.post5.id);
        expect(posts.posts[1].id).toBe(UnitPost.post4.id);
        expect(posts.posts[2].id).toBe(UnitPost.post3.id);
    });

    it("Should paginate posts with a specified limit", async () => {
        const page1 = await getAllPostsByAuthorIdUseCase.execute(0, 2, UnitUser.john.id);
        expect(page1.posts).toHaveLength(2);
        expect(page1.posts[0].id).toBe("550e8400-e29b-41d4-a716-446655440500");
        expect(page1.posts[1].id).toBe("550e8400-e29b-41d4-a716-446655440400");

        const page2 = await getAllPostsByAuthorIdUseCase.execute(2, 2, UnitUser.john.id);
        expect(page2.posts).toHaveLength(2);
        expect(page2.posts[0].id).toBe("550e8400-e29b-41d4-a716-446655440300");
        expect(page2.posts[1].id).toBe("550e8400-e29b-41d4-a716-446655440200");
    });

    it("Should return posts with populated user data (id, profilePicture, name & firstName)", async () => {
        const posts = await getAllPostsByAuthorIdUseCase.execute(0, 10, UnitUser.john.id);

        expect(posts.posts).toHaveLength(5);

        const returnedPost: any = posts.posts[0];
        expect(returnedPost.authorId).toBeDefined();
        expect(returnedPost.authorId).toBe(UnitUser.john.id);

        expect(returnedPost.author).toBeDefined();
        expect(returnedPost.author.id).toBe(UnitUser.john.id);
        expect(returnedPost.author.name).toBe(UnitUser.john.name);
        expect(returnedPost.author.firstName).toBe(UnitUser.john.firstName);
        expect(returnedPost.author.profilePicture).toBe(UnitUser.john.profilePicture);
    });

    it("sShould return hasMore: true when more posts exist", async () => {
        const result = await getAllPostsByAuthorIdUseCase.execute( 1, 2, UnitUser.john.id);

        expect(result.hasMore).toBe(true);
        expect(result.posts).toHaveLength(2);
    });

    it("Should return hasMore: false when no more posts exist", async () => {
        const result = await getAllPostsByAuthorIdUseCase.execute(1, 10, UnitUser.john.id);

        expect(result.hasMore).toBe(false);
        expect(result.posts).toHaveLength(4);
    });
});