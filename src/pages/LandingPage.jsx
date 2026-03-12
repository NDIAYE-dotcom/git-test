import { useMemo, useState } from 'react'
import './landing-page.css'

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  nationalId: '',
  gender: 'Masculin',
  paymentReference: '',
  photo: '',
}

function LandingPage({ settings, stats, onApplicationSubmit }) {
  const [formData, setFormData] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const spotlightStats = useMemo(
    () => [
      { label: 'Contribution', value: `${settings.feeAmount.toLocaleString('fr-FR')} FCFA` },
      { label: 'Traitement', value: settings.processingDelay },
      { label: 'Suivi', value: 'Carte physique + virtuelle' },
    ],
    [settings.feeAmount, settings.processingDelay],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handlePhotoChange = (event) => {
    const [file] = event.target.files ?? []

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({ ...current, photo: String(reader.result) }))
    }
    reader.readAsDataURL(file)
  }

  const validateStepOne = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.address,
      formData.nationalId,
      formData.gender,
      formData.photo,
    ]

    const isValid = requiredFields.every((value) => value && String(value).trim().length > 0)

    if (!isValid) {
      setError('Veuillez renseigner tous les champs et ajouter une photo avant de continuer.')
      return false
    }

    return true
  }

  const goToPaymentStep = () => {
    if (!validateStepOne()) {
      return
    }

    setError('')
    setStep(2)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.paymentReference.trim()) {
      setError('Veuillez indiquer la référence ou la confirmation de votre paiement Wave.')
      return
    }

    setError('')
    onApplicationSubmit(formData)
    setSubmitted(true)
    setStep(1)
    setFormData(initialForm)
  }

  return (
    <div className="landing-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-tag">Adhésion digitale</p>
          <h2>
            Obtenez votre carte de membre ACD facilement.
          </h2>
          <p className="hero-description">
            Inscription, paiement Wave et validation rapide.
          </p>
          <div className="hero-actions">
            <a href="#inscription" className="secondary-button">
              Acheter une carte membre
            </a>
            <a href="#processus" className="secondary-button">
              Voir le processus
            </a>
          </div>
          <ul className="hero-benefits">
            <li>Formulaire unique et facile à remplir</li>
            <li>Paiement Wave obligatoire avant validation</li>
            <li>Carte disponible après approbation de l'administration</li>
          </ul>
        </div>

        <div className="hero-side">
          <div className="hero-summary-card">
            <p className="section-tag">Vue d'ensemble</p>
            <h3>Parcours simple</h3>
            <div className="summary-steps concise">
              <article>
                <strong>1. Inscription</strong>
              </article>
              <article>
                <strong>2. Paiement Wave</strong>
              </article>
              <article>
                <strong>3. Validation et carte</strong>
              </article>
            </div>
          </div>

          <div className="hero-grid compact-grid">
            {spotlightStats.map((item) => (
              <article className="metric-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <article>
          <h3>Inscription rapide</h3>
          <p>
            Formulaire unique avec photo, identité, adresse, téléphone et contribution obligatoire.
          </p>
        </article>
        <article>
          <h3>Cartes membres</h3>
          <p>
            Carte physique gérée par l&apos;administration et carte virtuelle disponible dans
            l&apos;espace membre.
          </p>
        </article>
        <article>
          <h3>Pilotage sécurisé</h3>
          <p>
            Suivi des paiements, validation des dossiers, export des membres et statistiques
            d&apos;adhésion.
          </p>
        </article>
      </section>

      <section className="timeline-panel" id="processus">
        <div className="timeline-copy">
          <p className="section-tag">Processus d&apos;adhésion</p>
          <h3>Un parcours lisible pour le membre et facile à administrer</h3>
          <p>
            La plateforme sépare clairement la collecte d'informations, la preuve de paiement,
            la vérification interne et la mise à disposition de la carte de membre.
          </p>
        </div>
        <div className="timeline-grid">
          <article>
            <strong>Étape 1</strong>
            <h4>Formulaire sécurisé</h4>
            <p>Le sympathisant renseigne ses informations personnelles et sa photo.</p>
          </article>
          <article>
            <strong>Étape 2</strong>
            <h4>Contribution Wave</h4>
            <p>Le système affiche le code marchand et le montant fixe de 1000 FCFA.</p>
          </article>
          <article>
            <strong>Étape 3</strong>
            <h4>Validation administrative</h4>
            <p>Le bureau politique vérifie le paiement, approuve la demande et active la carte.</p>
          </article>
          <article>
            <strong>Étape 4</strong>
            <h4>Carte disponible</h4>
            <p>
              Le membre récupère sa carte physique et consulte sa version virtuelle en ligne.
            </p>
          </article>
        </div>
      </section>

      <section className="registration-panel" id="inscription">
        <div className="registration-copy">
          <p className="section-tag">Formulaire d&apos;inscription</p>
          <h3>Collecte maîtrisée des données avant validation finale</h3>
          <p>
            Le formulaire ci-dessous prépare la demande d&apos;adhésion. Le paiement Wave est
            obligatoire avant enregistrement du dossier.
          </p>
          <div className="security-card">
            <h4>Sécurité et conformité</h4>
            <ul>
              <li>Données structurées pour un branchement direct à Supabase.</li>
              <li>Photos membres prêtes à être stockées dans un bucket sécurisé.</li>
              <li>
                Workflow de validation séparé entre demande, paiement et activation.
              </li>
            </ul>
          </div>
        </div>

        <div className="registration-card">
          <div className="step-indicator">
            <span className={step === 1 ? 'active' : ''}>1. Identité</span>
            <span className={step === 2 ? 'active' : ''}>2. Paiement Wave</span>
          </div>

          {submitted ? (
            <div className="confirmation-card">
              <p className="section-tag">Demande enregistrée</p>
              <h4>Confirmation automatique</h4>
              <p>
                Merci pour votre inscription. Votre demande d&apos;adhésion a été enregistrée avec
                succès. Votre carte de membre sera disponible dans un délai maximum de 48 heures.
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="form-grid">
                <label>
                  Nom
                  <input name="lastName" value={formData.lastName} onChange={handleChange} />
                </label>
                <label>
                  Prénom
                  <input name="firstName" value={formData.firstName} onChange={handleChange} />
                </label>
                <label>
                  Numéro de téléphone
                  <input name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <label>
                  Adresse
                  <input name="address" value={formData.address} onChange={handleChange} />
                </label>
                <label>
                  Numéro de carte nationale d&apos;identité
                  <input name="nationalId" value={formData.nationalId} onChange={handleChange} />
                </label>
                <label>
                  Sexe
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option>Masculin</option>
                    <option>Féminin</option>
                  </select>
                </label>
                <label className="photo-field">
                  Photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                </label>
                {formData.photo ? (
                  <div className="photo-preview">
                    <img src={formData.photo} alt="Aperçu du membre" />
                  </div>
                ) : null}
                <button
                  type="button"
                  className="primary-button full-width"
                  onClick={goToPaymentStep}
                >
                  Continuer vers le paiement
                </button>
              </div>
            ) : (
              <div className="payment-step">
                <div className="payment-card">
                  <span>Code marchand Wave</span>
                  <strong>{settings.waveMerchantCode}</strong>
                </div>
                <div className="payment-card emphasis">
                  <span>Montant de la contribution</span>
                  <strong>{settings.feeAmount.toLocaleString('fr-FR')} FCFA</strong>
                </div>
                <p>
                  Après votre paiement via Wave Mobile Money, renseignez votre référence de
                  transaction pour finaliser la demande.
                </p>
                <label>
                  Référence ou confirmation de paiement
                  <input
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={handleChange}
                    placeholder="Ex: WAVE-445566"
                  />
                </label>
                <div className="payment-actions">
                  <button type="button" className="secondary-button" onClick={() => setStep(1)}>
                    Retour
                  </button>
                  <button type="submit" className="primary-button">
                    Valider mon inscription
                  </button>
                </div>
              </div>
            )}

            {error ? <p className="form-error">{error}</p> : null}
          </form>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
