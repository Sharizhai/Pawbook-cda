import {AnimalData} from "$domain/entities/Animals";
import { UserData } from '$domain/entities/Users';

/**
 * Response DTO for SearchUserOrPetUserCase
 */
type SearchUserResult = Pick<UserData, "id" | "firstName" | "name" | "profilePicture"> & { kind: "user" };

type SearchPetResult = Pick<AnimalData, "ownerId" | "name" | "type" | "picture"> & { kind: "animal" };

export interface SearchUserOrPetUserResponseDto {
    users: SearchUserResult[];
    animals: SearchPetResult[];
}