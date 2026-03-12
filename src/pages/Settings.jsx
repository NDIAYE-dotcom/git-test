import './Settings.css'

export function Settings() {
  return (
    <section className="settings">
      <article className="panel">
        <h3>Parametres du poste</h3>
        <p>
          Cette section permet de parametrer le nom du poste, les impressions, les alertes de stock et les droits
          des utilisateurs.
        </p>
        <ul>
          <li>Nom du poste de sante</li>
          <li>Seuils d'alerte de stock par defaut</li>
          <li>Notification des paiements et consultations</li>
          <li>Gestion des profils et roles</li>
        </ul>
      </article>

      <article className="panel">
        <h3>Journal des entrees</h3>
        <p>Le journal centralise les activites suivantes:</p>
        <ul>
          <li>Consultations</li>
          <li>Ventes medicaments</li>
          <li>Paiements</li>
          <li>Ajouts et modifications de stock</li>
        </ul>
      </article>
    </section>
  )
}
