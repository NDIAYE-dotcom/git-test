import { useState } from 'react'
import './Pharmacy.css'

const emptyMedicine = {
  name: '',
  purchasePrice: '',
  salePrice: '',
  quantity: '',
  expirationDate: '',
  alertThreshold: 10,
}

export function Pharmacy({ stock, onAddMedicine, onUpdateMedicine, onDeleteMedicine }) {
  const [formData, setFormData] = useState(emptyMedicine)
  const [editingId, setEditingId] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      quantity: Number(formData.quantity),
      alertThreshold: Number(formData.alertThreshold),
    }

    if (editingId) {
      onUpdateMedicine({ ...payload, id: editingId })
      setEditingId(null)
    } else {
      onAddMedicine(payload)
    }

    setFormData(emptyMedicine)
  }

  const startEdit = (medicine) => {
    setEditingId(medicine.id)
    setFormData({ ...medicine })
  }

  return (
    <section className="pharmacy">
      <div className="panel">
        <h3>{editingId ? 'Modifier un medicament' : 'Ajouter un medicament'}</h3>
        <form className="pharmacy__form" onSubmit={handleSubmit}>
          <input
            placeholder="Nom du medicament"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Prix achat"
            value={formData.purchasePrice}
            onChange={(event) => setFormData((prev) => ({ ...prev, purchasePrice: event.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Prix vente"
            value={formData.salePrice}
            onChange={(event) => setFormData((prev) => ({ ...prev, salePrice: event.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Quantite"
            value={formData.quantity}
            onChange={(event) => setFormData((prev) => ({ ...prev, quantity: event.target.value }))}
            required
          />
          <input
            type="date"
            value={formData.expirationDate}
            onChange={(event) => setFormData((prev) => ({ ...prev, expirationDate: event.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Seuil d'alerte"
            value={formData.alertThreshold}
            onChange={(event) => setFormData((prev) => ({ ...prev, alertThreshold: event.target.value }))}
            required
          />
          <button type="submit">{editingId ? 'Mettre a jour' : 'Ajouter'}</button>
        </form>
      </div>

      <div className="panel">
        <h3>Stock et alertes rupture</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix achat</th>
                <th>Prix vente</th>
                <th>Stock</th>
                <th>Expiration</th>
                <th>Alerte</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((medicine) => (
                <tr key={medicine.id}>
                  <td data-label="Nom">{medicine.name}</td>
                  <td data-label="Prix achat">{medicine.purchasePrice} FCFA</td>
                  <td data-label="Prix vente">{medicine.salePrice} FCFA</td>
                  <td data-label="Stock">{medicine.quantity}</td>
                  <td data-label="Expiration">{medicine.expirationDate}</td>
                  <td data-label="Alerte">
                    <span className={medicine.quantity <= medicine.alertThreshold ? 'stock-alert' : 'stock-ok'}>
                      {medicine.quantity <= medicine.alertThreshold ? 'Rupture proche' : 'Stable'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="pharmacy__actions">
                      <button type="button" onClick={() => startEdit(medicine)}>
                        Modifier
                      </button>
                      <button type="button" onClick={() => onDeleteMedicine(medicine.id)}>
                        Supprimer
                      </button>
                    </div>
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
