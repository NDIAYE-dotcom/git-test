const STORAGE_KEY = 'acd-platform-state'

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`
}

const defaultSettings = {
  movementName: 'Alliance Citoyenne pour le Développement',
  shortName: 'ACD',
  feeAmount: 1000,
  waveMerchantCode: 'WAVE-ACD-221144',
  processingDelay: '48 heures',
  logoLabel: 'ACD',
}

const defaultState = {
  settings: defaultSettings,
  applications: [
    {
      id: 'application-seed-1',
      firstName: 'Fatou',
      lastName: 'Sow',
      phone: '77 123 45 67',
      address: 'Rufisque, Dakar',
      nationalId: '1851999999999',
      gender: 'Féminin',
      photo: '',
      contributionAmount: 1000,
      paymentReference: 'WAVE-998811',
      paymentDeclared: true,
      paymentVerified: false,
      status: 'pending',
      submittedAt: '2026-03-09T10:00:00.000Z',
    },
    {
      id: 'application-seed-2',
      firstName: 'Mamadou',
      lastName: 'Diallo',
      phone: '78 987 65 43',
      address: 'Thiès, Keur Mame El Hadji',
      nationalId: '1761888888888',
      gender: 'Masculin',
      photo: '',
      contributionAmount: 1000,
      paymentReference: 'WAVE-114477',
      paymentDeclared: true,
      paymentVerified: true,
      status: 'pending',
      submittedAt: '2026-03-08T12:30:00.000Z',
      paymentReviewedAt: '2026-03-08T14:00:00.000Z',
    },
  ],
  members: [
    {
      id: 'member-seed-1',
      firstName: 'Aminata',
      lastName: 'Ba',
      phone: '70 321 45 67',
      address: 'Saint-Louis, Sor',
      nationalId: '1841777777777',
      gender: 'Féminin',
      photo: '',
      memberNumber: 'ACD-2026-0001',
      joinedAt: '2026-02-14T09:00:00.000Z',
      qrValue: 'ACD-2026-0001|Aminata Ba|2026-02-14',
      cardStatus: 'active',
    },
    {
      id: 'member-seed-2',
      firstName: 'Ibrahima',
      lastName: 'Ndiaye',
      phone: '76 456 78 90',
      address: 'Kaolack, Médina Baye',
      nationalId: '1801666666666',
      gender: 'Masculin',
      photo: '',
      memberNumber: 'ACD-2026-0002',
      joinedAt: '2026-02-18T16:20:00.000Z',
      qrValue: 'ACD-2026-0002|Ibrahima Ndiaye|2026-02-18',
      cardStatus: 'active',
    },
  ],
  notifications: [
    {
      id: 'notification-seed-1',
      scope: 'all',
      title: 'Réunion du bureau politique',
      message: 'Point de coordination prévu vendredi à 17h00 sur les nouvelles adhésions.',
      date: '2026-03-10T09:00:00.000Z',
    },
    {
      id: 'notification-seed-2',
      scope: 'member',
      memberId: 'member-seed-1',
      title: 'Carte physique prête',
      message:
        'Votre carte physique est disponible au siège pour retrait sur présentation de votre CNI.',
      date: '2026-03-11T11:20:00.000Z',
    },
  ],
}

export function loadPlatformState() {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY)

  if (!rawState) {
    return defaultState
  }

  try {
    return JSON.parse(rawState)
  } catch {
    return defaultState
  }
}

export function persistPlatformState(state) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createApplicationRecord(formData, state) {
  return {
    id: makeId('application'),
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    nationalId: formData.nationalId.trim(),
    gender: formData.gender,
    photo: formData.photo,
    contributionAmount: state.settings.feeAmount,
    paymentReference: formData.paymentReference.trim(),
    paymentDeclared: true,
    paymentVerified: false,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
}

export function createMemberFromApplication(application, state) {
  const sequence = state.members.length + 1
  const memberNumber = `${state.settings.shortName}-${new Date().getFullYear()}-${String(sequence).padStart(4, '0')}`
  const fullName = `${application.firstName} ${application.lastName}`

  return {
    id: makeId('member'),
    firstName: application.firstName,
    lastName: application.lastName,
    phone: application.phone,
    address: application.address,
    nationalId: application.nationalId,
    gender: application.gender,
    photo: application.photo,
    memberNumber,
    joinedAt: new Date().toISOString(),
    qrValue: `${memberNumber}|${fullName}|${new Date().toISOString().slice(0, 10)}`,
    cardStatus: 'active',
  }
}

export function serializeMembersCsv(members) {
  const header = ['Numero', 'Nom', 'Prenom', 'Telephone', 'Adresse', 'Sexe', 'Date adhesion']
  const lines = members.map((member) =>
    [
      member.memberNumber,
      member.lastName,
      member.firstName,
      member.phone,
      member.address,
      member.gender,
      formatDate(member.joinedAt),
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(','),
  )

  return [header.join(','), ...lines].join('\n')
}

export function downloadTextFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  window.URL.revokeObjectURL(url)
}

export function buildVirtualCardSvg(member, qrCodeDataUrl, settings) {
  const fullName = `${member.firstName} ${member.lastName}`
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
  const photoBlock = member.photo
    ? `
      <defs>
        <clipPath id="avatarClip">
          <rect x="48" y="78" width="180" height="220" rx="28" ry="28" />
        </clipPath>
      </defs>
      <image href="${escapeXml(member.photo)}" x="48" y="78" width="180" height="220" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />
    `
    : `
      <rect x="48" y="78" width="180" height="220" rx="28" fill="#eef3ef" />
      <text x="138" y="192" text-anchor="middle" font-family="Avenir Next, Segoe UI, sans-serif" font-size="64" font-weight="700" fill="#173632">${escapeXml(initials)}</text>
    `

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="920" height="520" viewBox="0 0 920 520" role="img" aria-label="Carte membre ${escapeXml(fullName)}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d2321" />
          <stop offset="100%" stop-color="#173632" />
        </linearGradient>
      </defs>
      <rect width="920" height="520" rx="44" fill="url(#bg)" />
      <circle cx="770" cy="86" r="140" fill="rgba(209,106,42,0.18)" />
      <rect x="24" y="24" width="872" height="472" rx="32" fill="none" stroke="rgba(255,255,255,0.16)" />
      <text x="52" y="54" font-family="Avenir Next, Segoe UI, sans-serif" font-size="18" letter-spacing="4" fill="#a8c3bc">MOUVEMENT POLITIQUE</text>
      <text x="52" y="330" font-family="Avenir Next, Segoe UI, sans-serif" font-size="22" fill="#a8c3bc">Carte de membre</text>
      <text x="52" y="376" font-family="Georgia, serif" font-size="38" font-weight="700" fill="#ffffff">${escapeXml(fullName)}</text>
      <text x="52" y="414" font-family="Avenir Next, Segoe UI, sans-serif" font-size="20" fill="#d4dedc">Numéro: ${escapeXml(member.memberNumber)}</text>
      <text x="52" y="446" font-family="Avenir Next, Segoe UI, sans-serif" font-size="20" fill="#d4dedc">Date d&apos;adhésion: ${escapeXml(formatDate(member.joinedAt))}</text>
      <text x="52" y="478" font-family="Avenir Next, Segoe UI, sans-serif" font-size="20" fill="#d4dedc">Statut: ${escapeXml(member.cardStatus)}</text>
      <rect x="684" y="316" width="176" height="156" rx="22" fill="#f5f2eb" />
      <image href="${escapeXml(qrCodeDataUrl)}" x="704" y="334" width="136" height="136" />
      <text x="684" y="74" font-family="Georgia, serif" font-size="44" font-weight="700" fill="#ffffff">${escapeXml(settings.logoLabel)}</text>
      <text x="684" y="106" font-family="Avenir Next, Segoe UI, sans-serif" font-size="18" fill="#d4dedc">${escapeXml(settings.movementName)}</text>
      ${photoBlock}
    </svg>
  `.trim()
}
