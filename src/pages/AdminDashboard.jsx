import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import './admin-dashboard.css'

function AdminDashboard({
  applications,
  members,
  settings,
  onApprove,
  onExport,
  onReject,
  onTogglePayment,
}) {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const filteredApplications = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    if (!query) {
      return applications
    }

    return applications.filter((application) =>
      [application.firstName, application.lastName, application.phone, application.nationalId]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [applications, deferredSearch])

  const filteredMembers = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    if (!query) {
      return members
    }

    return members.filter((member) =>
      [member.firstName, member.lastName, member.phone, member.memberNumber]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [deferredSearch, members])

  const stats = useMemo(() => {
    const pending = applications.filter((application) => application.status === 'pending').length
    const rejected = applications.filter((application) => application.status === 'rejected').length
    const verifiedPayments = applications.filter(
      (application) => application.paymentVerified,
    ).length

    return [
      { label: 'Inscriptions totales', value: applications.length },
      { label: 'Membres validés', value: members.length },
      { label: 'Paiements vérifiés', value: verifiedPayments },
      { label: 'Dossiers en attente', value: pending },
      { label: 'Dossiers rejetés', value: rejected },
      {
        label: 'Contributions suivies',
        value: `${(members.length * settings.feeAmount).toLocaleString('fr-FR')} FCFA`,
      },
    ]
  }, [applications, members.length, settings.feeAmount])

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div>
          <p className="admin-tag">Bureau politique</p>
          <h2>Supervision complète des adhésions, paiements et cartes membres.</h2>
        </div>
        <div className="admin-controls">
          <label>
            Recherche globale
            <input
              value={search}
              onChange={(event) => {
                const nextValue = event.target.value
                startTransition(() => setSearch(nextValue))
              }}
              placeholder="Nom, téléphone, numéro membre"
            />
          </label>
          <button type="button" onClick={onExport}>
            Exporter la liste des membres
          </button>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-panels">
        <div className="admin-card">
          <div className="panel-header">
            <p className="admin-tag">Demandes d&apos;adhésion</p>
            <h3>Validation des inscriptions</h3>
          </div>

          <div className="record-list">
            {filteredApplications.map((application) => (
              <article key={application.id} className="record-card">
                <div>
                  <strong>
                    {application.firstName} {application.lastName}
                  </strong>
                  <p>
                    {application.phone} · {application.gender} · CNI {application.nationalId}
                  </p>
                  <span>{application.address}</span>
                </div>
                <div className="record-meta">
                  <span className={`status-pill ${application.status}`}>{application.status}</span>
                  <span
                    className={application.paymentVerified ? 'badge success' : 'badge warning'}
                  >
                    {application.paymentVerified ? 'Paiement vérifié' : 'Paiement à vérifier'}
                  </span>
                  <small>
                    Contribution: {application.contributionAmount.toLocaleString('fr-FR')} FCFA
                  </small>
                  <small>Réf. Wave: {application.paymentReference || 'Non renseignée'}</small>
                </div>
                <div className="record-actions">
                  <button type="button" onClick={() => onTogglePayment(application.id)}>
                    {application.paymentVerified
                      ? 'Annuler la vérification'
                      : 'Marquer paiement vérifié'}
                  </button>
                  <button
                    type="button"
                    disabled={
                      !application.paymentVerified || application.status !== 'pending'
                    }
                    onClick={() => onApprove(application.id)}
                  >
                    Valider l&apos;adhésion
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={application.status !== 'pending'}
                    onClick={() => onReject(application.id)}
                  >
                    Refuser
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="panel-header">
            <p className="admin-tag">Base membres</p>
            <h3>Cartes et numérotation</h3>
          </div>

          <div className="record-list compact">
            {filteredMembers.map((member) => (
              <article key={member.id} className="member-row">
                <div>
                  <strong>
                    {member.firstName} {member.lastName}
                  </strong>
                  <p>
                    {member.memberNumber} · {member.phone}
                  </p>
                </div>
                <div>
                  <span className="badge success">Carte virtuelle active</span>
                  <small>{new Date(member.joinedAt).toLocaleDateString('fr-FR')}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
