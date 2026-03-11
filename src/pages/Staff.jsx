import { useState } from 'react'
import './Staff.css'

const emptyStaff = {
  name: '',
  role: '',
  phone: '',
  schedule: '',
  guardStart: '',
  guardEnd: '',
  onDuty: false,
}

export function Staff({ staff, onAddStaff, onUpdateStaff }) {
  const [formData, setFormData] = useState(emptyStaff)
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (editingId) {
      onUpdateStaff({ ...formData, id: editingId })
      setEditingId(null)
    } else {
      onAddStaff(formData)
    }
    setFormData(emptyStaff)
  }

  const startEdit = (member) => {
    setEditingId(member.id)
    setFormData({ ...member })
  }

  return (
    <section className="staff">
      <div className="panel">
        <h3>{editingId ? 'Modifier personnel' : 'Ajouter personnel'}</h3>
        <form className="staff__form" onSubmit={handleSubmit}>
          <input
            placeholder="Nom"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            placeholder="Poste"
            value={formData.role}
            onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
            required
          />
          <input
            placeholder="Telephone"
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
          <input
            placeholder="Horaires"
            value={formData.schedule}
            onChange={(event) => setFormData((prev) => ({ ...prev, schedule: event.target.value }))}
            required
          />
          <input
            type="time"
            value={formData.guardStart}
            onChange={(event) => setFormData((prev) => ({ ...prev, guardStart: event.target.value }))}
            required
          />
          <input
            type="time"
            value={formData.guardEnd}
            onChange={(event) => setFormData((prev) => ({ ...prev, guardEnd: event.target.value }))}
            required
          />
          <label className="staff__checkbox">
            <input
              type="checkbox"
              checked={formData.onDuty}
              onChange={(event) => setFormData((prev) => ({ ...prev, onDuty: event.target.checked }))}
            />
            En service
          </label>
          <button type="submit">{editingId ? 'Mettre a jour' : 'Ajouter'}</button>
        </form>
      </div>

      <div className="panel">
        <h3>Planning de service</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Poste</th>
                <th>Telephone</th>
                <th>Horaires</th>
                <th>Montee de garde</th>
                <th>Descente de garde</th>
                <th>Etat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td data-label="Nom">{member.name}</td>
                  <td data-label="Poste">{member.role}</td>
                  <td data-label="Telephone">{member.phone}</td>
                  <td data-label="Horaires">{member.schedule}</td>
                  <td data-label="Montee de garde">{member.guardStart}</td>
                  <td data-label="Descente de garde">{member.guardEnd}</td>
                  <td data-label="Etat">{member.onDuty ? 'En service' : 'Repos'}</td>
                  <td data-label="Action">
                    <button type="button" onClick={() => startEdit(member)}>
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
