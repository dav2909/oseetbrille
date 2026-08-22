import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Accepter uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { prenom, email } = req.body;

  if (!email || !prenom) {
    return res.status(400).json({ message: 'Prénom et e-mail requis.' });
  }

  try {
    // 1. Envoi de l'e-mail de confirmation à la participante
    await resend.emails.send({
      from: 'La Maison Ose & Brille <onboarding@resend.dev>', // Ou votre domaine personnalisé validé
      to: email,
      subject: 'Confirmation de votre inscription au Queen Day 👑',
      html: `
        <h2>Bonjour ${prenom},</h2>
        <p>Votre place pour le <strong>Queen Day</strong> est bien réservée !</p>
        <p><strong>Rappel de l'événement :</strong></p>
        <ul>
          <li><strong>Date :</strong> Samedi 29 Août</li>
          <li><strong>Horaire :</strong> 14h00 – 17h00</li>
          <li><strong>Format :</strong> En Ligne (Zoom)</li>
        </ul>
        <p>Vous recevrez le lien Zoom quelques heures avant le début de l'événement.</p>
        <br>
        <p>À très vite,<br><em>L'équipe La Maison Ose & Brille®</em></p>
      `,
    });

    // 2. Notification reçue sur votre boîte mail personnelle
    await resend.emails.send({
      from: 'Notification Site <onboarding@resend.dev>',
      to: 'VOTRE_EMAIL_PERSONNEL@gmail.com', // Remplacez par votre adresse mail
      subject: `🚨 Nouvelle inscription Queen Day : ${prenom}`,
      html: `<p><strong>Nouvel inscrit au Queen Day :</strong></p><p>Prénom: ${prenom}</p><p>E-mail: ${email}</p>`,
    });

    return res.status(200).json({ success: true, message: 'Inscription validée avec succès !' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
  }
}
