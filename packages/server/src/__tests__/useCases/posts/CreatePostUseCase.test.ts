import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {beforeAll, describe, it, expect} from "vitest";
import {Container} from "$types/container";
import {PostCreationDto} from "$presentation/dto/validation";
import {CreatePostUseCase} from "$application/use-cases/post/CreatePostUseCase";

describe("Use case: we should be able to create a post", () => {
    let createPostUseCase: CreatePostUseCase;
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");

        createPostUseCase = new CreatePostUseCase(postRepository, userRepository);

        await userRepository.save(UnitUser.john);
    })

    it("Should return an error if there is no text & no media", async () => {
        const invalidData = {
            authorId: UnitUser.john.id,
            textContent: "",
            photoContent: [],
        } as PostCreationDto;

        await expect(createPostUseCase.execute(invalidData)).rejects.toThrow("Du texte ou une image est requis");
    });

    it("Should return an error if there is no media & text content is spaces", async () => {
        const dataWithSpaces = {
            authorId: UnitUser.john.id,
            textContent: "        ",
            photoContent: [],
        } as PostCreationDto;

        await expect(createPostUseCase.execute(dataWithSpaces)).rejects.toThrow("Du texte ou une image est requis");
    });

    it("Should create a post with text only", async () => {
        const textOnlyData = {
            authorId: UnitUser.john.id,
            textContent: "coucou",
            photoContent: [],
        } as PostCreationDto;

        const createdPost = await createPostUseCase.execute(textOnlyData);

        expect(createdPost).toBeDefined();
        expect(createdPost.authorId).toBe(UnitUser.john.id);
        expect(createdPost.textContent).toBe("coucou");
        expect(createdPost.photoContent).toStrictEqual([]);
    });

    it("Should create a post with media only", async () => {
        const photoOnlyData = {
            authorId: UnitUser.john.id,
            textContent: "",
            photoContent: ["urldunephoto"],
        } as PostCreationDto;

        const createdPost = await createPostUseCase.execute(photoOnlyData);

        expect(createdPost).toBeDefined();
        expect(createdPost.authorId).toBe(UnitUser.john.id);
        expect(createdPost.textContent).toBe("");
        expect(createdPost.photoContent).toStrictEqual(["urldunephoto"]);
    });

    it("Should create a post with both text and media", async () => {
        const textAndPhotoData = {
            authorId: UnitUser.john.id,
            textContent: "coucou",
            photoContent: ["urldunephoto"],
        } as PostCreationDto;

        const createdPost = await createPostUseCase.execute(textAndPhotoData);

        expect(createdPost).toBeDefined();
        expect(createdPost.id).toBeDefined();
        expect(createdPost.authorId).toBe(UnitUser.john.id);
        expect(createdPost.textContent).toBe("coucou");
        expect(createdPost.photoContent).toStrictEqual(["urldunephoto"]);
    });
})