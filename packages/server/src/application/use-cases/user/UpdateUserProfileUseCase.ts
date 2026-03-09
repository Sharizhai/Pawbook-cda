import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {UserUpdateDto, userUpdateValidation} from "$presentation/dto/validation";
import {User} from "$domain/entities/Users";

export class UpdateUserProfileUseCase {
    constructor(
        private readonly userRepository: IUserRepository
) {}

    async execute(id: string, dto: UserUpdateDto): Promise <User> {
        if (!id) {
            throw new Error("User ID is required");
        }

        const validation = userUpdateValidation.safeParse(dto);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = user.updateWith(validation.data);

        return await this.userRepository.save(updatedUser);
    }
}