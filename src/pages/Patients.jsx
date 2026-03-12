import { useMemo, useState } from 'react'
import './Patients.css'

const emptyPatient = {
  firstName: '',
  lastName: '',
  age: '',
  sex: 'Femme',
  phone: '',
  address: '',
  consultationDate: new Date().toISOString().slice(0, 10),
  diagnosis: '',
}

export function Patients({ patients, onAddPatient, onUpdatePatient }) {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyPatient)

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
      return (
        fullName.includes(search.toLowerCase()) ||
        patient.phone.toLowerCase().includes(search.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [patients, search])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (editingId) {
      onUpdatePatient({ ...formData, id: editingId, age: Number(formData.age) })
      setEditingId(null)
    } else {
      onAddPatient({ ...formData, age: Number(formData.age) })
    }
    setFormData(emptyPatient)
  }

  const startEdit = (patient) => {
    setEditingId(patient.id)
    setFormData({ ...patient })
  }

  return (
    <section className="patients">
      <div className="panel">
        <h3>{editingId ? 'Modifier un patient' : 'Ajouter un patient'}</h3>
        <form className="patients__form" onSubmit={handleSubmit}>
          <input name="firstName" placeholder="Prenom" value={formData.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
          <input name="age" placeholder="Age" type="number" value={formData.age} onChange={handleChange} required />
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option>Femme</option>
            <option>Homme</option>
          </select>
          <input name="phone" placeholder="Telephone" value={formData.phone} onChange={handleChange} required />
          <input name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} required />
          <input
            name="consultationDate"
            type="date"
            value={formData.consultationDate}
            onChange={handleChange}
            required
          />
          <input name="diagnosis" placeholder="Diagnostic" value={formData.diagnosis} onChange={handleChange} required />
          <button type="submit">{editingId ? 'Mettre a jour' : 'Enregistrer'}</button>
        </form>
      </div>

      <div className="panel">
        <h3>Historique des consultations</h3>
        <input
          className="patients__search"
          placeholder="Rechercher patient / telephone / diagnostic"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Sexe</th>
                <th>Date</th>
                <th>Diagnostic</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td data-label="Patient">{patient.firstName} {patient.lastName}</td>
                  <td data-label="Age">{patient.age}</td>
                  <td data-label="Sexe">{patient.sex}</td>
                  <td data-label="Date">{patient.consultationDate}</td>
                  <td data-label="Diagnostic">{patient.diagnosis}</td>
                  <td data-label="Action">
                    <button type="button" onClick={() => startEdit(patient)}>
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
