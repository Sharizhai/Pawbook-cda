import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {UserUpdateDto} from "$presentation/dto/validation";
import {User} from "$domain/entities/Users";

export class UpdateUserProfileUseCase {
    constructor(
        private readonly userRepository: IUserRepository
) {}

    async execute(id: string, dto: UserUpdateDto): Promise <User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = user.updateWith(dto);

        return await this.userRepository.save(updatedUser);
    }
}