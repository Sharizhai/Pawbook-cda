import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {FollowAUserUseCase} from "$application/use-cases/follow/FollowAUserUseCase";
import {FollowCreationDto} from "$presentation/dto/validation";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitFollow} from "../../seeds/unit-follow";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";

describe("Use case: We should be able to follow an other user", () => {
    let userRepository: IUserRepository;
    let followRepository: IFollowRepository;
    let followAUserUseCase: FollowAUserUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        followRepository = c.resolve<IFollowRepository>("followRepository");

        followAUserUseCase = new FollowAUserUseCase(followRepository, userRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
        await userRepository.save(UnitUser.modette);

        await followRepository.save(UnitFollow.johnModette);
    })

    it("Should return an error if no user with this following id is found", async () => {
        const nonExistantFollowingIdData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "nonExistantFollowingId"
        } as FollowCreationDto;

        await expect(followAUserUseCase.execute(nonExistantFollowingIdData)).rejects.toThrow("followingId must be a valid UUID");
    });

    it("Should throw an error if no user with this follower id is found", async () => {
        const nonExistantFollowerIdData = {
            followerId: "nonExistantFollowerIdData",
            followingId: "550e8400-e29b-41d4-a716-446655440001"
        } as FollowCreationDto;

        await expect(followAUserUseCase.execute(nonExistantFollowerIdData)).rejects.toThrow("followerId must be a valid UUID");
    });

    it("Should throw an error if user tries to follow himself", async () => {
        const userTriesToFollowHimselfData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "550e8400-e29b-41d4-a716-446655440000"
        } as FollowCreationDto;

        await expect(followAUserUseCase.execute(userTriesToFollowHimselfData)).rejects.toThrow("Vous ne pouvez pas vous suivre vous-même");
    });

    it("Should throw an error if user already follows target", async () => {
        await expect(followAUserUseCase.execute(UnitFollow.johnModette)).rejects.toThrow("Vous suivez déjà cet utilisateur");
    });

    it("Should create a follow", async () => {
        const validData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "550e8400-e29b-41d4-a716-446655440001"
        } as FollowCreationDto;

        const follow = await followAUserUseCase.execute(validData);

        expect(follow).toBeDefined();
        expect(follow.followerId).toBe("550e8400-e29b-41d4-a716-446655440000");
        expect(follow.followingId).toBe("550e8400-e29b-41d4-a716-446655440001");
    });
})