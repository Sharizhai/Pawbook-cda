const LOGO_URL = process.env.LOGO_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const welcomeEmail = (firstName: string, id: string) => {
    return {
        subject: `Bienvenue sur Pawbook ${firstName} !`,
        html: `
      <div style="font-family: Arial, sans-serif; width: 100%; max-width: 700px; margin: 0 auto; background-color: #EEE7E2; padding: 25px 50px;">
        <img src="${LOGO_URL}" alt="Pawbook Logo" style="max-width: 50px;">
        <hr style="border: 1px solid rgba(30, 138, 182, 0.5); margin: 20px 0;">
        <h2 style="color: #001F31;">Bienvenue sur Pawbook, ${firstName} !</h2>
        
        <p>
          Merci de t’être inscrit(e) sur <strong>Pawbook</strong> !
          Nous sommes ravis de te compter parmi notre communauté d’amoureux des animaux.
        </p>

        <p>
          Sur Pawbook, tu peux :
        </p>

        <ul>
          <li>Créer le profil de tes animaux</li>
          <li>Partager avec la communauté des photos et des moments de leur quotidien</li>
          <li>Découvrir les animaux des autres membres</li>
          <li>Interagir avec la communauté️</li>
        </ul>

        <p>
          Crée un profil pour ton animal dès maintenant !
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${FRONTEND_URL}/#/profile/${id}" 
             style="background-color: rgba(30, 138, 182, 0.5); 
                    color: #001F31;  
                    text-decoration: none; 
                    border-radius: 0.375rem;
                    border: 1px solid rgba(30, 138, 182, 0.5);
                    display: inline-block;
                    font-size: 0.9rem;
                    font-weight: bold;
                    padding: 0.625rem 1.25rem;
                    cursor: pointer;
                    text-align: center;">
            Ajouter mon premier animal
          </a>
        </div>

        <p>
          À très vite sur Pawbook !
        </p>

        <hr style="border: 1px solid rgba(30, 138, 182, 0.5); margin: 20px 0;">
        
        <p style="color: #888; font-size: 12px;">L'équipe Pawbook</p>
      </div>
    `
    };
};