import {describe, it, expect, beforeAll} from "vitest";
import {PostFixture} from "../../fixtures/postFixture";
import {Post} from "$domain/entities/Posts";
import {c} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import {Like} from "$domain/entities/Likes";
import {Container} from "$types/container";
import container from "$config/dependencyInjection";
import {IPostRepository} from "$domain/interfaces/postRepository.interface";

describe("Usecase: We must be able to get all posts", () => {
    let postRepository = IPostRepository;

    beforeAll(async () => {
        const c: Container = container;
        postRepository = c.resolve<IPostRepository>("postRepository");

        await postRepository.create(UnitPost.post1);
        await postRepository.create(UnitPost.post2);
        await postRepository.create(UnitPost.post3);
        await postRepository.create(UnitPost.post4);
        await postRepository.create(UnitPost.post5);


    })

    it("should return an empty array of likes if no like are found", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.posts).toEqual([]);
        expect(result.data.hasMore).toBe(false);
        expect(result.data.total).toBe(0);
    });

    it("should return posts with populated user data (id, profilePicture, name & firstName)", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data.posts).toHaveLength(1);

        const returnedPost = result.data.posts[0];
        expect(returnedPost.author).toBeDefined();
        expect(returnedPost.author.id).toBe(author1.id);
        expect(returnedPost.author.name).toBe(author1.name);
        expect(returnedPost.author.firstName).toBe(author1.firstName);
        expect(returnedPost.author.profilePicture).toBe(author1.profilePicture);
        expect(returnedPost.author.email).toBeUndefined();
    });

    it("should return posts sorted by newest first", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data.posts).toHaveLength(3);
        expect(result.data.posts[0].id).toBe(post2.id);
        expect(result.data.posts[1].id).toBe(post3.id);
        expect(result.data.posts[2].id).toBe(post1.id);
    });

    it("should return an array of posts if some are found", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data.posts).toHaveLength(2);
        expect(result.data.posts[0].textContent).toBe("Deuxième post");
        expect(result.data.posts[1].textContent).toBe("Premier post");
    });

    it("should paginate posts with a specified limit", async () => {
        const resultPage1 = await getAllPostsUseCase.execute({ page: 1, limit: 2 });
        expect(resultPage1.data.posts).toHaveLength(2);
        expect(resultPage1.data.posts[0].id).toBe("post-5");
        expect(resultPage1.data.posts[1].id).toBe("post-4");

        const resultPage2 = await getAllPostsUseCase.execute({ page: 2, limit: 2 });
        expect(resultPage2.data.posts).toHaveLength(2);
        expect(resultPage2.data.posts[0].id).toBe("post-3");
        expect(resultPage2.data.posts[1].id).toBe("post-2");
    });

    it("should return hasMore: true when more posts exist", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 2 });

        expect(result.data.hasMore).toBe(true);
        expect(result.data.posts).toHaveLength(2);
    });

    it("should return hasMore: false when no more posts exist", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.data.hasMore).toBe(false);
        expect(result.data.posts).toHaveLength(2);
    });

    it("should include likesCount and commentsCount for each post", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 2 });

        expect(result.data.posts).toHaveLength(1);
        const returnedPost = result.data.posts[0];
        expect(returnedPost.likesCount).toBe(2);
        expect(returnedPost.commentsCount).toBe(2);
    });

    it("should return an empty array of comments if no comment are found", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 2 });

        expect(result.data.posts).toHaveLength(1);
        const returnedPost = result.data.posts[0];
        expect(returnedPost.comments).toEqual([]);
        expect(returnedPost.commentsCount).toBe(0);
    });

    it("should return populated comments with textContent and populated author data (id, profilePicture, name & firstName)", async () => {
        const result = await getAllPostsUseCase.execute({ page: 1, limit: 10 });

        expect(result.data.posts).toHaveLength(1);
        const returnedPost = result.data.posts[0];

        expect(returnedPost.comments).toHaveLength(2);

        const firstComment = returnedPost.comments[0];
        expect(firstComment.textContent).toBe("Super post !");
        expect(firstComment.author).toBeDefined();
        expect(firstComment.author.id).toBe(commenter1.id);
        expect(firstComment.author.name).toBe(commenter1.name);
        expect(firstComment.author.firstName).toBe(commenter1.firstName);
        expect(firstComment.author.profilePicture).toBe(commenter1.profilePicture);
        expect(firstComment.author.email).toBeUndefined();

        const secondComment = returnedPost.comments[1];
        expect(secondComment.textContent).toBe("Je suis d'accord");
        expect(secondComment.author).toBeDefined();
        expect(secondComment.author.id).toBe(author2.id);
        expect(secondComment.author.name).toBe(author2.name);
        expect(secondComment.author.firstName).toBe(author2.firstName);
        expect(secondComment.author.profilePicture).toBe(author2.profilePicture);
    });
});