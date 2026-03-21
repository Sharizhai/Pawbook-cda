import { z } from "zod";
import {Types} from "mongoose";
import {type} from "node:os";
import {sanitizeString} from "$utils/stringUtils.utils";

//En cas de besoin, on a une liste d'adresses e-mail blacklistées
//TODO:
//Faire un vrai système de blacklistage (par e-mail, IP...)
const blacklistedEmails = ["shrek@swamp.de", "donkey@swamp.de"];

const sanitizedStringSchema = (schema: z.ZodString) =>
    z.string().transform(value => sanitizeString(value)).pipe(schema);

const ReportReasonEnum = z.enum([
    "SPAM",
    "HARASSMENT",
    "HATE_SPEECH",
    "VIOLENCE",
    "INAPPROPRIATE",
    "SEXUAL_CONTENT",
    "FALSE_INFORMATION",
    "COPYRIGHT",
    "ANIMAL_ABUSE",
    "SELF_HARM",
    "OTHER"
]);

export const loginValidation = z.object({
    email: z.string().trim().toLowerCase().email({ error: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { error: "Cette adresse email n'est pas autorisée" }),
    password: z.string().min(1, { error: "Mot de passe requis" })
});

export const userCreationValidation = z.object({
    name: sanitizedStringSchema(z.string().min(2, { error: "Le nom est requis" })),
    firstName: sanitizedStringSchema(z.string().min(2, { error: "Le prénom est requis" })),
    email: z.email({ error: "Adresse e-mail invalide" }).refine((email): boolean => {
        return !blacklistedEmails.includes(email)
    }, { error: "Cette adresse email n'est pas autorisée" }),
    password: z.string()
        .min(12, { error: "Le mot de passe doit faire au moins 12 caractères" })
        .regex(/[0-9]/, { error: "Le mot de passe doit contenir au moins un chiffre" })
        .regex(/[!@$#^&(),.?":|<>{}]/, { error: "Le mot de passe doit contenir au moins un caractère spécial" })
        .regex(/[A-Z]/, { error: "Le mot de passe doit contenir au moins une majuscule" })
        .regex(/[a-z]/, { error: "Le mot de passe doit contenir au moins une minuscule" }),
    role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
    profilePicture: z.string().optional(),
    profileDescription: sanitizedStringSchema(z.string().max(150, { error: "La description ne doit pas dépasser 150 caractères" })).optional(),
});

export const userUpdateValidation = z.object({
    profilePicture: z.string().optional(),
    profileDescription: sanitizedStringSchema(z.string().max(150, { error: "The description must not exceed 150 characters." })).optional(),
});

export const animalCreationValidation = z.object({
    ownerId: z.uuid("ownerId must be a valid UUID"),
    name: sanitizedStringSchema(z.string().min(2, { error: "Le nom est requis" })),
    type: sanitizedStringSchema(z.string().min(2, { error: "Le type est requis" })),
    race: sanitizedStringSchema(z.string()).optional(),
    age: z.number().optional(),
    picture: z.string().optional(),
    description: sanitizedStringSchema(z.string().max(150, { error: "La description ne doit pas dépasser 150 caractères" })).optional(),
});

export const postCreationValidation = z.object({
    authorId: z.uuid("authorId must be a valid UUID"),
    textContent: sanitizedStringSchema(z.string()).optional(),
    photoContent: z.array(z.string()).optional(),
    moderationStatus: z.enum(["NONE", "PENDING", "APPROVED", "REJECTED"]).default("NONE"),
}).refine(data => {
    return (data.textContent && data.textContent.length > 0) ||
        (data.photoContent && data.photoContent.length > 0);
}, {
    error: "Du texte ou une image est requis"
});

export const followCreationValidation = z.object({
    followerId: z.uuid("followerId must be a valid UUID"),
    followingId: z.uuid("followingId must be a valid UUID"),
}).refine(
    (data) => data.followerId !== data.followingId, {
        error:"Vous ne pouvez pas vous suivre vous-même",
    });

export const followDeletionValidation = z.object({
    followerId: z.uuid("followerId must be a valid UUID"),
    followingId: z.uuid("followingId must be a valid UUID"),
});

export const postReportCreationValidation = z.object({
    postId: z.uuid("postId must be a valid UUID"),
    reporterId: z.uuid("reporterId must be a valid UUID"),
    reason: z.string().min(1, "Report reason not found").pipe(ReportReasonEnum),
    description: sanitizedStringSchema(z.string().max(500, { error: "Report description is too long" })).optional(),
});

export const passwordUpdateValidation = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
        .min(12, { error: "Password must be at least 12 characters long" })
        .regex(/[0-9]/, { error: "Password must contain at least one number" })
        .regex(/[!@$#^&(),.?":|<>{}]/, { error: "Password must contain at least one special character" })
        .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" }),
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});

export type LoginDto = z.infer<typeof loginValidation>;
export type UserCreationDto = z.infer<typeof userCreationValidation>;
export type UserUpdateDto = z.infer<typeof userUpdateValidation>;
export type AnimalCreationDto = z.infer<typeof animalCreationValidation>;
export type PostCreationDto = z.infer<typeof postCreationValidation>;
export type FollowCreationDto = z.infer<typeof followCreationValidation>;
export type FollowDeletionDto = z.infer<typeof followDeletionValidation>;
export type PostReportCreationDto = z.infer<typeof postReportCreationValidation>;
export type PasswordUpdateDto = z.infer<typeof passwordUpdateValidation>;