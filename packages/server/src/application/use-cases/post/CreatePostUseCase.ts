import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {PostCreationDto, postCreationValidation} from "$presentation/dto/validation";
import {Post} from "$domain/entities/Posts";

export class CreatePostUseCase {
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: PostCreationDto): Promise<Post> {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            textContent: dto.textContent?.trim(),
            photoContent: dto.photoContent ?? [],
        }

        // 2. Validation des données entrantes
        const validation = postCreationValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence du créateur
        const author = await this.userRepository.findById(validData.authorId);
        if (!author) {
            throw new Error("Utilisateur non trouvé");
        }

        // 4. Création du post
        const post = Post.create({
            authorId: validData.authorId,
            textContent: validData.textContent,
            photoContent: validData.photoContent,
        });

        // 5. Sauvegarde du post
        const savedPost = await this.postRepository.save(post);

        // 6. Mise à jour de l'utilisateur avec le nouveau post
        const updatedUser = author.updateWith({
            posts: [...author.posts, savedPost.id]
        });
        await this.userRepository.save(updatedUser);

        // 7. Retour du post créé
        return savedPost;
    }
}