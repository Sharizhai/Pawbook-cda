import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {describe, it, expect, beforeAll} from "vitest";
import container from "$config/dependencyInjection";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {UnitUser} from "../../seeds/unit-user";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";

describe("Usecase: We must be able to get all posts", () => {
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;
    let getAllPostsUseCase: GetAllPostsUseCase;

    beforeAll(async () => {
        const c: Container = container;
        postRepository = c.resolve<IPostRepository>("postRepository");
        userRepository = c.resolve<IUserRepository>("userRepository");

        if (postRepository instanceof InMemoryPostRepository) {
            postRepository.setUserRepository(userRepository);
        }

        getAllPostsUseCase = new GetAllPostsUseCase(postRepository);

        await postRepository.save(UnitPost.post1);
        await postRepository.save(UnitPost.post2);
        await postRepository.save(UnitPost.post3);
        await postRepository.save(UnitPost.post4);
        await postRepository.save(UnitPost.post5);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
    })

    it("should return posts with populated user data (id, profilePicture, name & firstName)", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

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

    it("should return posts sorted by newest first", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

        expect(posts.posts).toHaveLength(5);
        expect(posts.posts[0].id).toBe(UnitPost.post5.id);
        expect(posts.posts[1].id).toBe(UnitPost.post4.id);
        expect(posts.posts[2].id).toBe(UnitPost.post3.id);
    });

    it("should return an array of posts if some are found", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

        expect(posts.posts).toHaveLength(5);
        expect(posts.posts[0].textContent).toBe("Cinquième post");
        expect(posts.posts[1].textContent).toBe("Quatrième post");
    });

    it("should paginate posts with a specified limit", async () => {
        const page1 = await getAllPostsUseCase.execute(0, 2);
        expect(page1.posts).toHaveLength(2);
        expect(page1.posts[0].id).toBe("550e8400-e29b-41d4-a716-446655440500");
        expect(page1.posts[1].id).toBe("550e8400-e29b-41d4-a716-446655440400");

        const page2 = await getAllPostsUseCase.execute(2, 2);
        expect(page2.posts).toHaveLength(2);
        expect(page2.posts[0].id).toBe("550e8400-e29b-41d4-a716-446655440300");
        expect(page2.posts[1].id).toBe("550e8400-e29b-41d4-a716-446655440200");
    });

    it("should return hasMore: true when more posts exist", async () => {
        const result = await getAllPostsUseCase.execute( 1, 2);

        expect(result.hasMore).toBe(true);
        expect(result.posts).toHaveLength(2);
    });

    it("should return hasMore: false when no more posts exist", async () => {
        const result = await getAllPostsUseCase.execute(1, 10);

        expect(result.hasMore).toBe(false);
        expect(result.posts).toHaveLength(4);
    });
});