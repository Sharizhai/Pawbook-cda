import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {describe, it, expect, beforeAll} from "vitest";
import container from "$config/dependencyInjection";
import {UnitPost} from "../../seeds/unit-post";
import {Container} from "$types/container";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {UnitUser} from "../../seeds/unit-user";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";
import {ILikeRepository} from "$domain/interfaces/likeRepository.interface";
import {ICommentRepository} from "$domain/interfaces/commentRepository.interface";
import {UnitComment} from "../../seeds/unit-comment";

describe("Usecase: We must be able to get all posts", () => {
    let userRepository: IUserRepository;
    let likeRepository: ILikeRepository;
    let commentRepository: ICommentRepository;
    let postRepository: IPostRepository;
    let getAllPostsUseCase: GetAllPostsUseCase;

    beforeAll(async () => {
        const c: Container = container;
        postRepository = c.resolve<IPostRepository>("postRepository");
        userRepository = c.resolve<IUserRepository>("userRepository");
        likeRepository = c.resolve<ILikeRepository>("likeRepository");
        commentRepository = c.resolve<ICommentRepository>("commentRepository");

        if (postRepository instanceof InMemoryPostRepository) {
            postRepository.setUserRepository(userRepository);
            postRepository.setLikeRepository(likeRepository);
            postRepository.setCommentRepository(commentRepository);
        }

        getAllPostsUseCase = new GetAllPostsUseCase(postRepository);

        await commentRepository.create(UnitComment.comment1);
        await commentRepository.create(UnitComment.comment2);

        await postRepository.create(UnitPost.post1);
        await postRepository.create(UnitPost.post2);
        await postRepository.create(UnitPost.post3);
        await postRepository.create(UnitPost.post4);
        await postRepository.create(UnitPost.post5);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
    })

    it("should return an empty array of likes if no like are found", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

        expect(posts.posts).toBeDefined();
        expect(posts.posts).toHaveLength(5);
    });

    it("should return posts with populated user data (id, profilePicture, name & firstName)", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

        expect(posts.posts).toHaveLength(5);

        const returnedPost = posts.posts[0];
        expect(returnedPost.authorId).toBeDefined();
        expect(returnedPost.authorId.id).toBe(UnitUser.john.id);
        expect(returnedPost.authorId.name).toBe(UnitUser.john.name);
        expect(returnedPost.authorId.firstName).toBe(UnitUser.john.firstName);
        expect(returnedPost.authorId.profilePicture).toBe(UnitUser.john.profilePicture);
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
        expect(page1.posts[0].id).toBe("post-5");
        expect(page1.posts[1].id).toBe("post-4");

        const page2 = await getAllPostsUseCase.execute(2, 2);
        expect(page2.posts).toHaveLength(2);
        expect(page2.posts[0].id).toBe("post-3");
        expect(page2.posts[1].id).toBe("post-2");
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

    it("should include likesCount and commentsCount for each post", async () => {
        const posts = await getAllPostsUseCase.execute(0, 2);

        expect(posts.posts).toHaveLength(2);
        const returnedPost = posts.posts[0];
        expect(returnedPost.likes?.length).toBe(2);
        expect(returnedPost.comments?.length).toBe(2);
    });

    it("should return an empty array of comments if no comment are found", async () => {
        const posts = await getAllPostsUseCase.execute(0, 2);

        expect(posts.posts).toHaveLength(2);
        const returnedPost = posts.posts[1];
        expect(returnedPost.comments).toEqual([]);
        expect(returnedPost.comments?.length).toBe(0);
    });

    it("should return populated comments with textContent and populated author data (id, profilePicture, name & firstName)", async () => {
        const posts = await getAllPostsUseCase.execute(0, 10);

        expect(posts.posts).toHaveLength(5);
        const returnedPost = posts.posts[0];

        expect(returnedPost.comments).toHaveLength(2);

        const firstComment = returnedPost.comments[0];
        expect(firstComment.textContent).toBe("Super post !");
        expect(firstComment.authorId).toBeDefined();
        expect(firstComment.authorId.id).toBe(UnitUser.john.id);
        expect(firstComment.authorId.name).toBe(UnitUser.john.name);
        expect(firstComment.authorId.firstName).toBe(UnitUser.john.firstName);
        expect(firstComment.authorId.profilePicture).toBe(UnitUser.john.profilePicture);
        expect(firstComment.authorId.email).toBeUndefined();

        const secondComment = returnedPost.comments[1];
        expect(secondComment.textContent).toBe("Je suis d'accord");
        expect(secondComment.authorId).toBeDefined();
        expect(secondComment.authorId.id).toBe(UnitUser.jane.id);
        expect(secondComment.authorId.name).toBe(UnitUser.jane.name);
        expect(secondComment.authorId.firstName).toBe(UnitUser.jane.firstName);
        expect(secondComment.authorId.profilePicture).toBe(UnitUser.jane.profilePicture);
    });
});