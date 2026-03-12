import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import './virtual-member-card.css'
import { buildVirtualCardSvg, downloadTextFile } from '../lib/platformStore.js'

function VirtualMemberCard({ member, settings }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(member.qrValue, {
      width: 200,
      margin: 1,
      color: {
        dark: '#173632',
        light: '#f7f3eb',
      },
    }).then((url) => {
      if (isMounted) {
        setQrCodeDataUrl(url)
      }
    })

    return () => {
      isMounted = false
    }
  }, [member.qrValue])

  const handleDownloadCard = () => {
    if (!qrCodeDataUrl) {
      return
    }

    const svg = buildVirtualCardSvg(member, qrCodeDataUrl, settings)
    downloadTextFile(`${member.memberNumber}-carte.svg`, svg, 'image/svg+xml;charset=utf-8')
  }

  return (
    <div className="virtual-card-wrapper">
      <div className="virtual-card">
        <div className="virtual-card-brand">
          <p>{settings.movementName}</p>
          <strong>{settings.logoLabel}</strong>
        </div>

        <div className="virtual-card-content">
          <div className="virtual-card-profile">
            {member.photo ? (
              <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} />
            ) : (
              <div className="virtual-card-placeholder">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
            )}
            <div>
              <span>Carte virtuelle</span>
              <h3>
                {member.firstName} {member.lastName}
              </h3>
              <p>{member.memberNumber}</p>
              <small>
                Adhésion le {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
              </small>
            </div>
          </div>

          <div className="virtual-card-qr">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR code membre" />
            ) : (
              <span>QR en cours…</span>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="download-button" onClick={handleDownloadCard}>
        Télécharger la carte virtuelle
      </button>
    </div>
  )
}

export default VirtualMemberCard
