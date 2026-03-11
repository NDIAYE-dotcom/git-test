import { useState } from 'react'
import { exportPrescriptionPdf, exportPrescriptionListPdf } from '../utils/exportPdf'
import './Prescriptions.css'

const emptyPrescription = {
  patientName: '',
  doctor: '',
  medicines: '',
  dosage: '',
  date: new Date().toISOString().slice(0, 10),
}

export function Prescriptions({ prescriptions, patients, stock, onAddPrescription }) {
  const [formData, setFormData] = useState(emptyPrescription)
  const [lastPrescription, setLastPrescription] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    onAddPrescription(formData)
    setLastPrescription(formData)
    setFormData(emptyPrescription)
  }

  return (
    <section className="prescriptions">
      <div className="panel">
        <h3>Creer une ordonnance</h3>
        <form className="prescriptions__form" onSubmit={handleSubmit}>
          <select
            value={formData.patientName}
            onChange={(event) => setFormData((prev) => ({ ...prev, patientName: event.target.value }))}
            required
          >
            <option value="">Choisir un patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={`${patient.firstName} ${patient.lastName}`}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
          <input
            placeholder="Medecin"
            value={formData.doctor}
            onChange={(event) => setFormData((prev) => ({ ...prev, doctor: event.target.value }))}
            required
          />
          <input
            placeholder="Medicaments (separes par virgule)"
            value={formData.medicines}
            onChange={(event) => setFormData((prev) => ({ ...prev, medicines: event.target.value }))}
            required
          />
          <input
            placeholder="Posologie"
            value={formData.dosage}
            onChange={(event) => setFormData((prev) => ({ ...prev, dosage: event.target.value }))}
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
            required
          />
          <div className="prescriptions__actions">
            <button type="submit">Enregistrer</button>
            <button
              type="button"
              disabled={!lastPrescription}
              onClick={() => lastPrescription && exportPrescriptionPdf(lastPrescription)}
            >
              Telecharger PDF
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h3>Historique des ordonnances</h3>
          {prescriptions.length > 0 && (
            <button type="button" className="btn-export" onClick={() => exportPrescriptionListPdf(prescriptions)}>
              Exporter liste PDF
            </button>
          )}
        </div>
        <p className="prescriptions__hint">Medicaments disponibles: {stock.length}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medecin</th>
                <th>Medicaments</th>
                <th>Posologie</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td data-label="Patient">{prescription.patientName}</td>
                  <td data-label="Medecin">{prescription.doctor}</td>
                  <td data-label="Medicaments">{prescription.medicines}</td>
                  <td data-label="Posologie">{prescription.dosage}</td>
                  <td data-label="Date">{prescription.date}</td>
                  <td data-label="Action">
                    <button
                      type="button"
                      className="btn-pdf-row"
                      title="Telecharger PDF"
                      onClick={() => exportPrescriptionPdf(prescription)}
                    >
                      PDF
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
