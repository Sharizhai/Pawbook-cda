import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {UnfollowAUserUseCase} from "$application/use-cases/follow/UnfollowAUserUseCase";
import {FollowDeletionDto} from "$presentation/dto/validation";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitFollow} from "../../seeds/unit-follow";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";

describe("Use case: We should be able to unfollow an other user", () => {
    let userRepository: IUserRepository;
    let followRepository: IFollowRepository;
    let unfollowAUserUseCase: UnfollowAUserUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        followRepository = c.resolve<IFollowRepository>("followRepository");

        unfollowAUserUseCase = new UnfollowAUserUseCase(followRepository, userRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
        await userRepository.save(UnitUser.loly);
        await userRepository.save(UnitUser.modette);

        await followRepository.save(UnitFollow.johnLoly);
        await followRepository.save(UnitFollow.johnModette);
    })

    it("Should return an error if no user with this following id is found", async () => {
        const nonExistantFollowingIdData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "nonExistantFollowingId"
        } as FollowDeletionDto;

        await expect(unfollowAUserUseCase.execute(nonExistantFollowingIdData)).rejects.toThrow("followingId must be a valid UUID");
    });

    it("Should throw an error if no user with this follower id is found", async () => {
        const nonExistantFollowerIdData = {
            followerId: "nonExistantFollowerIdData",
            followingId: "550e8400-e29b-41d4-a716-446655440001"
        } as FollowDeletionDto;

        await expect(unfollowAUserUseCase.execute(nonExistantFollowerIdData)).rejects.toThrow("followerId must be a valid UUID");
    });

    it("Should throw an error if user is not following the user target", async () => {
        const nonFollowingUserTargetData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "550e8400-e29b-41d4-a716-446655440001"
        } as FollowDeletionDto;

        await expect(unfollowAUserUseCase.execute(nonFollowingUserTargetData)).rejects.toThrow("Vous ne suivez pas cet utilisateur");
    });

    it("Should verify follow relationship exists before unfollowing", async () => {
        const validData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "550e8400-e29b-41d4-a716-446655440002"
        } as FollowDeletionDto;

        const existsBefore = await followRepository.exists(validData.followerId, validData.followingId);
        expect(existsBefore).toEqual(true);

        await unfollowAUserUseCase.execute(validData);

        const existsAfter = await followRepository.exists(validData.followerId, validData.followingId);
        expect(existsAfter).toBe(false);
    });

    it("Should delete a follow", async () => {
        const validData = {
            followerId: "550e8400-e29b-41d4-a716-446655440000",
            followingId: "550e8400-e29b-41d4-a716-446655440003"
        } as FollowDeletionDto;

        const unfollow = await unfollowAUserUseCase.execute(validData);

        expect(unfollow).toBeDefined();
        expect(unfollow.followerId).toBe("550e8400-e29b-41d4-a716-446655440000");
        expect(unfollow.followingId).toBe("550e8400-e29b-41d4-a716-446655440003");

        const followExists = await followRepository.exists(
            validData.followerId,
            validData.followingId
        );

        expect(followExists).toBe(false);
    });
})