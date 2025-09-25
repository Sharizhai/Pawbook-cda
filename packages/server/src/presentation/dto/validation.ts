import { z } from "zod";

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

export type LoginDto = z.infer<typeof loginValidation>;