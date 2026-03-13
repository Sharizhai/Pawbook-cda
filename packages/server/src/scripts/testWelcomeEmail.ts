import * as dotenv from "dotenv";
dotenv.config();

import {NodemailerEmailServices} from "$infrastructure/mailing/nodemailerEmailServices";

const emailService = new NodemailerEmailServices();

emailService.sendConfirmationEmail("louise-et-testa@gmail.com", "Louise", "58951cad-1d21-44b6-87e8-598355a67b60")
    .then(() => console.log("✅ Mail envoyé avec succès"))
    .catch((error) => console.error("❌ Erreur :", error));