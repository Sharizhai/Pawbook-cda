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
    ownerId: z.string(),
    name: z.string().min(2, { message: "Le nom est requis" }),
    type: z.string().min(2, { message: "Le type est requis" }),
    race: z.string().min(2).optional(),
    age: z.number().optional(),
    picture: z.string().optional(),
    description: z.string().max(150, { message: "La description ne doit pas dépasser 150 caractères" }).optional(),
});

export type LoginDto = z.infer<typeof loginValidation>;
export type UserCreationDto = z.infer<typeof userCreationValidation>;
export type AnimalCreationDto = z.infer<typeof animalCreationValidation>;