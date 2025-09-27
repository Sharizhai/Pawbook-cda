import { asClass, asFunction, createContainer } from "awilix";

import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";

import {InMemoryUserRepository} from "$infrastructure/repositories/inMemoryUserRepository";
import {MongoUserRepository} from "$infrastructure/repositories/MongoUserRepository";
import {JwtAuthService} from "$infrastructure/auth/jwtAuthServices";
import {Argon2Services} from "$infrastructure/auth/argon2Services";

import {AuthServices} from "$application/services/authServices";

import {env} from "$config/env";

export interface Dependencies {
    userRepository: IUserRepository;
    jwtAuthService: IJwtServices;
    argon2Services: IPasswordServices;
    authServices: IAuthServices;
}

const container = createContainer<Dependencies>({
    injectionMode: 'PROXY'
});

const userRepositoryClass = env.NODE_ENV === "test"
    ? InMemoryUserRepository
    : MongoUserRepository;

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
});

export default container;