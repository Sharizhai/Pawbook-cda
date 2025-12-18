import { z } from "zod";
import {Types} from "mongoose";
import {type} from "node:os";

//En cas de besoin, on a une liste d'adresses e-mail blacklistées
//TODO:
//Faire un vrai système de blacklistage (par e-mail, IP...)
const blacklistedEmails = ["shrek@swamp.de", "donkey@swamp.de"];

export const loginValidation = z.object({
    email: z.string().email({ message: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { message: "Cette adresse email n'est pas autorisée" }),
    password: z.string().min(1, { message: "Mot de passe requis" })
});

export const userCreationValidation = z.object({
    name: z.string().min(2, { message: "Le nom est requis" }),
    firstName: z.string().min(2, { message: "Le prénom est requis" }),
    email: z.string().email({ message: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { message: "Cette adresse email n'est pas autorisée" }),
    password: z.string()
        .min(12, { message: "Le mot de passe doit faire au moins 12 caractères" })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
        .regex(/[!@$#^&(),.?":|<>{}]/, { message: "Le mot de passe doit contenir au moins un caractère spécial" })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" }),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    profilePicture: z.string().optional(),
    profileDescription: z.string().max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
});

export const animalCreationValidation = z.object({
    ownerId: z.string().uuid("ownerId must be a valid UUID"),
    name: z.string().min(2, { message: "Le nom est requis" }),
    type: z.string().min(2, { message: "Le type est requis" }),
    race: z.string().optional(),
    age: z.number().optional(),
    picture: z.string().optional(),
    description: z.string().max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
});

export const postCreationValidation = z.object({
    authorId: z.string().uuid("authorId must be a valid UUID"),
    textContent: z.string().optional(),
    photoContent: z.array(z.string()).optional(),
}).refine(data => {
    return (data.textContent && data.textContent.length > 0) ||
        (data.photoContent && data.photoContent.length > 0);
}, {
    message: "Du texte ou une image est requis"
});

export const followCreationValidation = z.object({
    followerId: z.string().uuid("followerId must be a valid UUID"),
    followingId: z.string().uuid("followingId must be a valid UUID"),
}).refine(
    (data) => data.followerId !== data.followingId, {
        message:"Vous ne pouvez pas vous suivre vous-même",
    });

export const followDeletionValidation = z.object({
    followerId: z.string().uuid("followerId must be a valid UUID"),
    followingId: z.string().uuid("followingId must be a valid UUID"),
});

export type LoginDto = z.infer<typeof loginValidation>;
export type UserCreationDto = z.infer<typeof userCreationValidation>;
export type AnimalCreationDto = z.infer<typeof animalCreationValidation>;
export type PostCreationDto = z.infer<typeof postCreationValidation>;
export type FollowCreationDto = z.infer<typeof followCreationValidation>;
export type FollowDeletionDto = z.infer<typeof followDeletionValidation>;