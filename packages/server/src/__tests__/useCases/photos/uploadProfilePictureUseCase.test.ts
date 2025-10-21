import {beforeAll, describe, it, expect, beforeEach, vi} from "vitest";
import {UploadProfilePictureUseCase} from "$application/use-cases/pictures/uploadProfilePictureUseCase";
import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";
import path from "path";

describe("Use case: We should be able to upload and modify a profile picture", () => {
    let userRepository: IUserRepository;
    let photoStorageServices: IPhotoStorageService;
    let uploadProfilePictureUseCase: UploadProfilePictureUseCase;
    let userId: string;

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
        photoStorageServices = c.resolve<IPhotoStorageService>("photoStorageServices");

        uploadProfilePictureUseCase = new UploadProfilePictureUseCase(userRepository, photoStorageServices);
    });

    beforeEach(async () => {
        const user = await userRepository.save(UnitUser.john);
        userId = user.id;
    })

    it("should throw an error if user doesn't exist", async () => {
        const mockFile = createMockFile();

        await expect(uploadProfilePictureUseCase.execute("invalid-user-id", mockFile))
            .rejects.toThrow("User not found");
    });

    it("should throw an error if file is not an image", async () => {
        const txtFile = createMockFile({
            mimetype: 'text/plain',
            originalname: 'document.txt'
        });

        await expect(uploadProfilePictureUseCase.execute(userId, txtFile))
            .rejects.toThrow("Le fichier doit être une image (JPEG, PNG ou WebP)");
    });

    it("should throw an error if file is larger than 15MB", async () => {
        const largeFile = createMockFile({
            size: 16 * 1024 * 1024 // 16MB
        });

        await expect(uploadProfilePictureUseCase.execute(userId, largeFile))
            .rejects.toThrow("La taille de l'image ne doit pas dépasser 15MB");
    });

    it("should delete the old profile picture before uploading new one", async () => {
        const deleteSpy = vi.spyOn(photoStorageServices, 'delete');
        const firstFile = createMockFile({ originalname: 'first.jpg' });
        const userWithFirstPhoto = await uploadProfilePictureUseCase.execute(userId, firstFile);

        expect(userWithFirstPhoto.profilePicture).toBeDefined();
        const firstPhotoUrl = userWithFirstPhoto.profilePicture!;

        const secondFile = createMockFile({ originalname: 'second.jpg' });
        const userWithSecondPhoto = await uploadProfilePictureUseCase.execute(userId, secondFile);

        expect(deleteSpy).toHaveBeenCalledWith(
            expect.stringContaining(`users/${userId}/profile/first`)
        );
        expect(userWithSecondPhoto.profilePicture).not.toBe(firstPhotoUrl);
        expect(userWithSecondPhoto.profilePicture).toContain('second.jpg');
    });

    it("should upload a profile picture and update user's profilePicture field", async () => {
        const mockFile = createMockFile();

        const result = await uploadProfilePictureUseCase.execute(userId, mockFile);

        expect(result.profilePicture).toContain(`users/${userId}/profile`);

        const updatedUser = await userRepository.findById(userId);

        expect(updatedUser?.profilePicture).toBe(result.profilePicture);
        expect(updatedUser?.profilePicture).toBeDefined();
    });

    it("should store file in correct folder structure", async () => {
        const mockFile = createMockFile();

        const result = await uploadProfilePictureUseCase.execute(userId, mockFile);

        expect(result.profilePicture).toMatch(new RegExp(`users/${userId}/profile`));
    });

    it("should accept valid image formats (JPEG, PNG, WebP)", async () => {
        const formats = [
            { mimetype: 'image/jpeg', name: 'photo.jpg' },
            { mimetype: 'image/png', name: 'photo.png' },
            { mimetype: 'image/webp', name: 'photo.webp' },
        ];

        for (const format of formats) {
            const mockFile = createMockFile({
                mimetype: format.mimetype,
                originalname: format.name
            });

            const result = await uploadProfilePictureUseCase.execute(userId, mockFile);
            expect(result.profilePicture).toBeDefined();
        }
    });

    it("should handle upload when user has no previous profile picture", async () => {
        const user = await userRepository.findById(userId);
        expect(user?.profilePicture).toBe("");

        const mockFile = createMockFile();
        const result = await uploadProfilePictureUseCase.execute(userId, mockFile);

        expect(result.profilePicture).toBeDefined();
        expect(result.profilePicture).toContain(`users/${userId}/profile`);
    });
});