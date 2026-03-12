import { useMemo, useState } from 'react'
import VirtualMemberCard from '../components/VirtualMemberCard.jsx'
import './member-portal.css'

function MemberPortal({ members, notifications, settings, onUpdateMember }) {
  const [credentials, setCredentials] = useState({ phone: '', memberNumber: '' })
  const [memberId, setMemberId] = useState('')
  const [error, setError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')

  const activeMember = useMemo(
    () => members.find((member) => member.id === memberId) ?? null,
    [memberId, members],
  )

  const memberNotifications = useMemo(() => {
    if (!activeMember) {
      return []
    }

    return notifications.filter(
      (notification) =>
        notification.scope === 'all' ||
        (notification.scope === 'member' && notification.memberId === activeMember.id),
    )
  }, [activeMember, notifications])

  const handleCredentialChange = (event) => {
    const { name, value } = event.target
    setCredentials((current) => ({ ...current, [name]: value }))
  }

  const handleConnect = (event) => {
    event.preventDefault()

    const match = members.find(
      (member) =>
        member.phone === credentials.phone.trim() &&
        member.memberNumber === credentials.memberNumber.trim(),
    )

    if (!match) {
      setError('Aucun membre approuvé ne correspond à ces informations.')
      return
    }

    setMemberId(match.id)
    setError('')
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target

    if (!activeMember) {
      return
    }

    onUpdateMember(activeMember.id, { [name]: value })
    setProfileMessage('Informations mises à jour dans votre espace personnel.')
  }

  return (
    <div className="member-portal">
      <section className="portal-hero">
        <div>
          <p className="portal-tag">Espace membre sécurisé</p>
          <h2>Consultez votre profil, vos notifications et votre carte virtuelle.</h2>
        </div>
        <p>
          L&apos;accès est simulé par numéro de membre et téléphone dans cette version. La
          connexion authentifiée Supabase est prête à être branchée via variables
          d&apos;environnement.
        </p>
      </section>

      {!activeMember ? (
        <section className="member-access-card">
          <div>
            <h3>Connexion membre</h3>
            <p>Utilisez un membre approuvé pour tester l&apos;espace personnel.</p>
          </div>
          <form className="access-form" onSubmit={handleConnect}>
            <label>
              Numéro de membre
              <input
                name="memberNumber"
                value={credentials.memberNumber}
                onChange={handleCredentialChange}
                placeholder="Ex: ACD-2026-0001"
              />
            </label>
            <label>
              Numéro de téléphone
              <input
                name="phone"
                value={credentials.phone}
                onChange={handleCredentialChange}
                placeholder="Ex: 70 321 45 67"
              />
            </label>
            <button type="submit">Accéder à mon espace</button>
          </form>
          {error ? <p className="portal-error">{error}</p> : null}
        </section>
      ) : (
        <>
          <section className="member-overview">
            <VirtualMemberCard member={activeMember} settings={settings} />

            <div className="member-profile-card">
              <div className="profile-header">
                <div>
                  <p className="portal-tag">Profil personnel</p>
                  <h3>
                    {activeMember.firstName} {activeMember.lastName}
                  </h3>
                </div>
                <button type="button" onClick={() => setMemberId('')}>
                  Déconnexion
                </button>
              </div>

              <div className="profile-grid">
                <label>
                  Téléphone
                  <input
                    name="phone"
                    value={activeMember.phone}
                    onChange={handleProfileChange}
                  />
                </label>
                <label>
                  Adresse
                  <input
                    name="address"
                    value={activeMember.address}
                    onChange={handleProfileChange}
                  />
                </label>
                <label>
                  Numéro membre
                  <input value={activeMember.memberNumber} readOnly />
                </label>
                <label>
                  Date d&apos;adhésion
                  <input
                    value={new Date(activeMember.joinedAt).toLocaleDateString('fr-FR')}
                    readOnly
                  />
                </label>
              </div>
              {profileMessage ? <p className="portal-success">{profileMessage}</p> : null}
            </div>
          </section>

          <section className="notification-panel">
            <div>
              <p className="portal-tag">Notifications</p>
              <h3>Messages du mouvement</h3>
            </div>
            <div className="notification-list">
              {memberNotifications.map((notification) => (
                <article key={notification.id}>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span>{new Date(notification.date).toLocaleDateString('fr-FR')}</span>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default MemberPortal
