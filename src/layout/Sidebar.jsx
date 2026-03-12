import './Sidebar.css'

const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'patients', label: 'Patients' },
  { id: 'prescriptions', label: 'Ordonnances' },
  { id: 'pharmacy', label: 'Pharmacie' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'accounting', label: 'Comptabilite' },
  { id: 'staff', label: 'Personnel' },
  { id: 'settings', label: 'Parametres' },
]

export function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__badge">PS</span>
        <div>
          <h1>Poste Sante</h1>
          <p>Gestion interne</p>
        </div>
      </div>

      <nav className="sidebar__menu">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__item ${activePage === item.id ? 'is-active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
