import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {User} from "$domain/entities/Users";

export class GetUserByIdUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(id: string): Promise<ReturnType<User["getProfileData"]>> {
        if (!id || id.trim().length === 0) {
            throw new Error("User ID is required");
        }

        const user =  await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user.getProfileData();
    }
}