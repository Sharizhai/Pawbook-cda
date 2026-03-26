import { User, UserData } from '$domain/entities/Users';
import {AnimalData} from "$domain/entities/Animals";

/**
 * Response DTO for SearchUserOrPetUserCase
 */
type SearchUserResult = Pick<UserData, "id" | "firstName" | "name" | "profilePicture">;

type SearchPetResult = Pick<AnimalData, "ownerId" | "name" | "type" | "picture">;

export interface SearchUserOrPetUserResponse {
    users: SearchUserResult[];
    animals: SearchPetResult[];
}