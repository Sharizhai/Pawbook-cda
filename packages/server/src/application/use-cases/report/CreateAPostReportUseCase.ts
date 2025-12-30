import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {PostReportCreationDto, postReportCreationValidation} from "$presentation/dto/validation";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {PostReport} from "$domain/entities/PostReports";

export class CreateAPostReportUseCase {
    constructor(
        private readonly postReportRepository: IPostReportRepository,
        private readonly postRepository: IPostRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: PostReportCreationDto): Promise<PostReport> {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            description: dto.description?.trim(),
        }

        // 2. Validation des données entrantes
        const validation = postReportCreationValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence du post
        const post = await this.postRepository.findById(validData.postId);
        if (!post) {
            throw new Error("Post not found");
        }

        // 4. Vérification de l'existence du reporteur
        const reporter = await this.userRepository.findById(validData.reporterId);
        if (!reporter) {
            throw new Error("User not found");
        }

        // 4. Création du report
        const postReport = PostReport.create({
            postId: validData.postId,
            reporterId: validData.reporterId,
            reason: validData.reason,
            description: validData.description,
        });

        // 5. Sauvegarde du report
        const savedReport = await this.postReportRepository.save(postReport);

        // 6. Retour du report créé
        return savedReport;
    }
}