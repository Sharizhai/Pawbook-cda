import {asClass, asFunction, asValue, createContainer} from "awilix";

import {ICommentRepository} from "$domain/interfaces/commentRepository.interface";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {ILikeRepository} from "$domain/interfaces/likeRepository.interface";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";

import {InMemoryUserRepository} from "$infrastructure/repositories/user/inMemoryUserRepository";
import {MongoUserRepository} from "$infrastructure/repositories/user/MongoUserRepository";

import {InMemoryPostRepository} from "$infrastructure/repositories/post/inMemoryPostRepository";
import {MongoPostRepository} from "$infrastructure/repositories/post/MongoPostRepository";

import {InMemoryCommentRepository} from "$infrastructure/repositories/comment/InMemoryCommentRepository";
import {MongoCommentRepository} from "$infrastructure/repositories/comment/MongoCommentRepository";

import {InMemoryLikeRepository} from "$infrastructure/repositories/like/inMemoryLikeRepository";
import {MongoLikeRepository} from "$infrastructure/repositories/like/MongoLikeRepository";

import {JwtAuthService} from "$infrastructure/auth/jwtAuthServices";
import {Argon2Services} from "$infrastructure/auth/argon2Services";

import {AuthServices} from "$application/services/authServices";

import {env} from "$config/env";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";

export interface Dependencies {
    jwtAuthService: IJwtServices;
    argon2Services: IPasswordServices;

    authServices: IAuthServices;

    userRepository: IUserRepository;
    postRepository: IPostRepository;
    commentRepository: ICommentRepository;
    likeRepository: ILikeRepository;

    getAllPostsUseCase: GetAllPostsUseCase;
}

const container = createContainer<Dependencies>({
    injectionMode: 'PROXY'
});

const userRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryUserRepository
    : MongoUserRepository;

const postRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryPostRepository
    : MongoPostRepository

const commentRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryCommentRepository
    : MongoCommentRepository;

const likeRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryLikeRepository
    : MongoLikeRepository;

console.log(userRepositoryClass);

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
    // === INFRASTRUCTURE LAYER - asClass pour l'injection automatique ===
    userRepository: asClass(userRepositoryClass).singleton(),
    postRepository: asClass(postRepositoryClass).singleton(),
    commentRepository: asClass(commentRepositoryClass).singleton(),
    likeRepository: asClass(likeRepositoryClass).singleton(),
    argon2Services: asClass(Argon2Services).singleton(),
    jwtAuthService: asFunction(() =>
        new JwtAuthService(env.JWT_SECRET, env.JWT_EXPIRATION_SECRET)
    ).singleton(),
    
    // === APPLICATION LAYER - asFunction pour les interfaces complexes ===
    authServices: asFunction((deps: Dependencies) =>
        new AuthServices(
            deps.userRepository,
            deps.argon2Services,
            deps.jwtAuthService
        )
    ).singleton(),

    // === PRESENTATION LAYER ===
    getAllPostsUseCase: asFunction((deps: Dependencies) =>
        new GetAllPostsUseCase(deps.postRepository)
    ).singleton(),
});

export default container;