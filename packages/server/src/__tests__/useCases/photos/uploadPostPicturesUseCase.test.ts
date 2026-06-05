import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";
import {beforeAll, describe, it, expect, beforeEach} from "vitest";
import container from "$config/dependencyInjection";
import {Container} from "$types/container";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {UnitUser} from "../../seeds/unit-user";
import {UnitPost} from "../../seeds/unit-post";
import path from "path";

describe.skip("Use case: We should be able to upload one or several pictures", () => {
    let userRepository: IUserRepository;
    let postRepository: IPostRepository;
    let photoStorageServices: IPhotoStorageService;
    let uploadPostPicturesUseCase: UploadPostPicturesUseCase;
    let userId: string;
    let postId: string;

    const createMockFile = (options: Partial<Express.Multer.File> = {}): Express.Multer.File => {
        return {
            fieldname: 'photo',
            originalname: options.originalname || 'test.jpg',
            mimetype: options.mimetype || 'image/jpeg',
            size: options.size || 1024 * 1024,
            buffer: Buffer.from('fake-image-data'),
            path: options.path || path.join(__dirname, '../../assets/test.jpg'),
            destination: '/tmp',
            filename: 'test-123.jpg',
            stream: null as any,
        } as Express.Multer.File;
    };

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        postRepository = c.resolve<IPostRepository>("postRepository");
        photoStorageServices = c.resolve<IPhotoStorageService>("photoStorageServices");

        uploadPostPicturesUseCase = new UploadPostPicturesUseCase(userRepository, postRepository, photoStorageServices);
    });

    beforeEach(async () => {
        const user = await userRepository.save(UnitUser.john);
        const post = await postRepository.save(UnitPost.post1);

        userId = user.id;
        postId = post.id;
    });

    it("should throw an error if user doesn't exist", async () => {
        const mockFile = createMockFile();

        await expect(uploadPostPicturesUseCase.execute("invalid-user-id", postId, mockFile))
            .rejects.toThrow("User not found");
    });

    it("should throw an error if post doesn't exist", async () => {
        const mockFile = createMockFile();

        await expect(uploadPostPicturesUseCase.execute(userId, "invalid-post-id", mockFile))
            .rejects.toThrow("User not found");
    });

    it("should throw an error if file is not an image", async () => {
        const txtFile = createMockFile({
            mimetype: 'text/plain',
            originalname: 'document.txt'
        });

        await expect(uploadPostPicturesUseCase.execute(userId, txtFile))
            .rejects.toThrow("File must be an image (JPEG, PNG ou WebP)");
    });

    it("should throw an error if file is larger than 15MB", async () => {
        const largeFile = createMockFile({
            size: 16 * 1024 * 1024 // 16MB
        });

        await expect(uploadPostPicturesUseCase.execute(userId, largeFile))
            .rejects.toThrow("The image size must not exceed 15MB");
    });

    it("should store file in correct folder structure", async () => {
        const mockFile = createMockFile();

        const result = await uploadPostPicturesUseCase.execute(userId, postId, mockFile);

        expect(result.profilePicture).toMatch(new RegExp(`users/${userId}/posts/${postId}`));
    });

    it("", async () => {

    });

    it("", async () => {

    });

    it("", async () => {

    });
})