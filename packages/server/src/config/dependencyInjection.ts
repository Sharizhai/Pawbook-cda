import {asClass, asFunction, asValue, Constructor, createContainer} from "awilix";

import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";
import {ICommentRepository} from "$domain/interfaces/repositories/commentRepository.interface";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {ILikeRepository} from "$domain/interfaces/repositories/likeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";

import {InMemoryUserRepository} from "$infrastructure/repositories/user/inMemoryUserRepository";
import {PostgresUserRepository} from "$infrastructure/repositories/user/PostgresUserRepository";
import {MongoUserRepository} from "$infrastructure/repositories/user/MongoUserRepository";

import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";
import {PostgresPostRepository} from "$infrastructure/repositories/post/PostgresPostRepository";
import {MongoPostRepository} from "$infrastructure/repositories/post/MongoPostRepository";

import {InMemoryCommentRepository} from "$infrastructure/repositories/comment/InMemoryCommentRepository";
import {MongoCommentRepository} from "$infrastructure/repositories/comment/MongoCommentRepository";

import {InMemoryLikeRepository} from "$infrastructure/repositories/like/inMemoryLikeRepository";
import {MongoLikeRepository} from "$infrastructure/repositories/like/MongoLikeRepository";

import {InMemoryAnimalRepository} from "$infrastructure/repositories/animal/inMemoryAnimalRepository";
import {PostgresAnimalRepository} from "$infrastructure/repositories/animal/PostgresAnimalRepository";

import {InMemoryFollowRepository} from "$infrastructure/repositories/follow/InMemoryFollowRepository";
import {PostgresFollowRepository} from "$infrastructure/repositories/follow/PostgresFollowRepository";

import {InMemoryPhotosStorageServices} from "$infrastructure/storage/inMemoryPhotoStorageServices";
import {CloudinaryStorageServices} from "$infrastructure/storage/cloudinaryStorageServices";

import {PostController} from "$presentation/controllers/postController";
import {UserController} from "$presentation/controllers/userController";
import {PhotoController} from "$presentation/controllers/photoController";
import {AnimalController} from "$presentation/controllers/animalController";
import {FollowController} from "$presentation/controllers/followController";

import {GetAllPostsByAuthorIdUseCase} from "$application/use-cases/post/GetAllPostsByAuthorIdUseCase";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {CreatePostUseCase} from "$application/use-cases/post/CreatePostUseCase";

import {CreateUserUseCase} from "$application/use-cases/user/CreateUserUseCase";
import {GetUserByIdUseCase} from "$application/use-cases/user/GetUserByIdUseCase";

import {CreateAnimalProfileUseCase} from "$application/use-cases/animal/CreateAnimalProfileUseCase";
import {GetAllAnimalsByOwnerIdUseCase} from "$application/use-cases/animal/GetAllAnimalsByOwnerIdUseCase";

import {FollowAUserUseCase} from "$application/use-cases/follow/FollowAUserUseCase";

import {UploadProfilePictureUseCase} from "$application/use-cases/pictures/uploadProfilePictureUseCase";

import {JwtAuthService} from "$infrastructure/auth/jwtAuthServices";
import {Argon2Services} from "$infrastructure/auth/argon2Services";

import {AuthServices} from "$application/services/authServices";

import {env} from "$config/env";
import {prisma} from "$config/prisma";
import {PrismaClient} from "@prisma/client";

export interface Dependencies {
    prisma: PrismaClient;

    jwtAuthService: IJwtServices;
    argon2Services: IPasswordServices;

    authServices: IAuthServices;

    photoStorageServices: IPhotoStorageService;

    userRepository: IUserRepository;
    postRepository: IPostRepository;
    commentRepository: ICommentRepository;
    likeRepository: ILikeRepository;
    animalRepository: IAnimalRepository;
    followRepository: IFollowRepository;

    postController: PostController;
    userController: UserController;
    photoController: PhotoController;
    animalController: AnimalController;
    followController: FollowController;

    getAllPostsByAuthorIdUseCase: GetAllPostsByAuthorIdUseCase;
    getAllPostsUseCase: GetAllPostsUseCase;
    createPostUseCase: CreatePostUseCase;

    createUserUserCase: CreateUserUseCase;
    getUserByIdUseCase: GetUserByIdUseCase;

    createAnimalProfileUseCase: CreateAnimalProfileUseCase;
    getAllAnimalsByOwnerIdUseCase: GetAllAnimalsByOwnerIdUseCase;

    followAUserUseCase: FollowAUserUseCase;

    uploadProfilePictureUseCase: UploadProfilePictureUseCase;
}

const container = createContainer<Dependencies>({
    injectionMode: 'PROXY'
});

/**
 * Choix du repository User selon l'environnement
 *
 * Variable d'environnement : USE_POSTGRES
 * - true  → PostgreSQL (via Prisma)
 * - false → MongoDB (via Mongoose)
 * - test  → InMemory
 */
const USE_POSTGRES = process.env.USE_POSTGRES === 'true';

const userRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryUserRepository
    : USE_POSTGRES
        ? PostgresUserRepository
        : MongoUserRepository;

const postRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryPostRepository
    : USE_POSTGRES
        ? PostgresPostRepository
        : MongoPostRepository;

const commentRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryCommentRepository
    : MongoCommentRepository;

const likeRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryLikeRepository
    : MongoLikeRepository;

const animalRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryAnimalRepository
    : PostgresAnimalRepository;

const followRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryFollowRepository
    : PostgresFollowRepository;

const photoStorageServiceClass = (env.NODE_ENV === "test"
    ? InMemoryPhotosStorageServices
    : CloudinaryStorageServices) as Constructor<IPhotoStorageService>;

console.log(`🔧 Environment: ${env.NODE_ENV}`);
console.log(`🗄️  User Repository: ${userRepositoryClass.name}`) ;
console.log(`📊 Database: ${USE_POSTGRES ? 'PostgreSQL' : 'MongoDB'}`);

/**
 * Stratégie d'injection des dépendances :
 * 
 * INFRASTRUCTURE LAYER (asClass) :
 * - Services simples sans interfaces TypeScript complexes
 * - L'injection automatique fonctionne parfaitement
 * - Maintien automatique des dépendances par awilix
 * 
 * APPLICATION LAYER (asFunction) :
 * - Services avec interfaces TypeScript (effacées à l'exécution)
 * - Injection explicite mais contrôlée
 * - Plus fiable pour les dépendances complexes
 */
container.register({
    prisma: asValue(prisma),
    // === INFRASTRUCTURE LAYER ===
    userRepository: asFunction(() => new userRepositoryClass(prisma)).singleton(),
    postRepository: asFunction(() => new postRepositoryClass(prisma)).singleton(),
    commentRepository: asClass(commentRepositoryClass).singleton(),
    likeRepository: asClass(likeRepositoryClass).singleton(),
    animalRepository: asFunction(() => new animalRepositoryClass(prisma)).singleton(),
    followRepository: asFunction(() => new followRepositoryClass(prisma)).singleton(),
    argon2Services: asClass(Argon2Services).singleton(),
    photoStorageServices: asClass(photoStorageServiceClass).singleton(),
    jwtAuthService: asFunction(() =>
        new JwtAuthService(env.JWT_SECRET, env.JWT_EXPIRATION_SECRET as any)
    ).singleton(),

    // === APPLICATION LAYER - asFunction pour les interfaces complexes ===
    authServices: asFunction((deps: Dependencies) =>
        new AuthServices(
            deps.userRepository,
            deps.argon2Services,
            deps.jwtAuthService
        )
    ).singleton(),

    // *** POSTS ***
    getAllPostsByAuthorIdUseCase: asFunction((deps: Dependencies) =>
        new GetAllPostsByAuthorIdUseCase(deps.postRepository, deps.userRepository)
    ).singleton(),

    getAllPostsUseCase: asFunction((deps: Dependencies) =>
        new GetAllPostsUseCase(deps.postRepository)
    ).singleton(),

    createPostUseCase: asFunction((deps: Dependencies) =>
        new CreatePostUseCase(deps.postRepository, deps.userRepository)
    ).singleton(),

    // *** USERS ***
    createUserUserCase: asFunction((deps: Dependencies) =>
        new CreateUserUseCase(deps.userRepository, deps.argon2Services)
    ).singleton(),

    getUserByIdUseCase: asFunction((deps: Dependencies) =>
        new GetUserByIdUseCase(deps.userRepository)
    ).singleton(),

    // *** ANIMALS ***
    createAnimalProfileUseCase: asFunction((deps: Dependencies) =>
        new CreateAnimalProfileUseCase(deps.animalRepository, deps.userRepository)
    ).singleton(),

    getAllAnimalsByOwnerIdUseCase: asFunction((deps: Dependencies) =>
        new GetAllAnimalsByOwnerIdUseCase(deps.animalRepository, deps.userRepository)
    ).singleton(),

    // *** FOLLOWS ***
    followAUserUseCase: asFunction((deps: Dependencies) =>
        new FollowAUserUseCase(deps.followRepository, deps.userRepository)
    ).singleton(),

    // *** PHOTOS ***
    uploadProfilePictureUseCase: asFunction((deps: Dependencies) =>
        new UploadProfilePictureUseCase(deps.userRepository, deps.photoStorageServices)
    ).singleton(),

    // === PRESENTATION LAYER ===
    postController: asFunction((deps: Dependencies) =>
        new PostController(
            deps.createPostUseCase,
            deps.getAllPostsUseCase,
            deps.getAllPostsByAuthorIdUseCase)
    ).singleton(),

    userController: asFunction((deps: Dependencies) =>
        new UserController(
            deps.createUserUserCase,
            deps.getUserByIdUseCase)
    ).singleton(),

    photoController: asFunction((deps: Dependencies) =>
        new PhotoController(deps.uploadProfilePictureUseCase)
    ),

    animalController: asFunction((deps: Dependencies) =>
        new AnimalController(
            deps.createAnimalProfileUseCase,
            deps.getAllAnimalsByOwnerIdUseCase)
    ).singleton(),

    followController: asFunction((deps: Dependencies) =>
        new FollowController(deps.followAUserUseCase)
    ).singleton(),
});

export default container;