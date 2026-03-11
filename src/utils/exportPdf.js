// jsPDF and autoTable are loaded dynamically the first time an export is triggered.

const POST_NAME = 'Poste de Santé'
const ACCENT = [33, 150, 243] // bleu

function addHeader(doc, title) {
  doc.setFillColor(...ACCENT)
  doc.rect(0, 0, 210, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(POST_NAME, 14, 10)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 14, 17)
  doc.setTextColor(0, 0, 0)
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')}  —  Page ${i} / ${pageCount}`,
      14,
      doc.internal.pageSize.height - 8,
    )
  }
}

// ─── Ticket unique ────────────────────────────────────────────────────────────
export async function exportTicketPdf(ticket) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  addHeader(doc, 'Ticket de caisse')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`Ticket N°:`, 14, 34)
  doc.setFont('helvetica', 'normal')
  doc.text(String(ticket.ticketNumber ?? ticket.id ?? '—'), 48, 34)

  doc.setFont('helvetica', 'bold')
  doc.text(`Date:`, 14, 41)
  doc.setFont('helvetica', 'normal')
  doc.text(String(ticket.date ?? '—'), 48, 41)

  doc.setFont('helvetica', 'bold')
  doc.text(`Patient:`, 14, 48)
  doc.setFont('helvetica', 'normal')
  doc.text(String(ticket.patientName ?? '—'), 48, 48)

  doc.setFont('helvetica', 'bold')
  doc.text(`Consultation:`, 14, 55)
  doc.setFont('helvetica', 'normal')
  doc.text(String(ticket.consultation ?? '—'), 48, 55)

  doc.setFont('helvetica', 'bold')
  doc.text(`Médicaments:`, 14, 62)
  doc.setFont('helvetica', 'normal')
  const medicLines = doc.splitTextToSize(String(ticket.medicines ?? '—'), 90)
  doc.text(medicLines, 48, 62)

  const afterMedic = 62 + medicLines.length * 6

  doc.setDrawColor(...ACCENT)
  doc.setLineWidth(0.5)
  doc.line(14, afterMedic + 2, 134, afterMedic + 2)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.text(`Total:`, 14, afterMedic + 10)
  doc.text(`${ticket.totalAmount ?? 0} FCFA`, 48, afterMedic + 10)
  doc.setTextColor(0, 0, 0)

  addFooter(doc)
  doc.save(`ticket-${ticket.ticketNumber ?? ticket.id}.pdf`)
}

// ─── Liste tickets ────────────────────────────────────────────────────────────
export async function exportTicketListPdf(tickets) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'Historique des tickets de caisse')

  autoTable(doc, {
    startY: 28,
    head: [['N° Ticket', 'Patient', 'Médicaments', 'Consultation', 'Montant (FCFA)', 'Date']],
    body: tickets.map((t) => [
      t.ticketNumber ?? t.id,
      t.patientName ?? '—',
      t.medicines ?? '—',
      t.consultation ?? '—',
      `${t.totalAmount ?? 0}`,
      t.date ?? '—',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [235, 245, 255] },
    columnStyles: { 2: { cellWidth: 45 } },
  })

  const total = tickets.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0)
  const finalY = doc.lastAutoTable.finalY + 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT)
  doc.text(`Total général: ${total} FCFA`, 14, finalY)
  doc.setTextColor(0, 0, 0)

  addFooter(doc)
  doc.save(`tickets-${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ─── Ordonnance unique ────────────────────────────────────────────────────────
export async function exportPrescriptionPdf(prescription) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  addHeader(doc, 'Ordonnance médicale')

  doc.setFontSize(10)

  doc.setFont('helvetica', 'bold')
  doc.text(`Date:`, 14, 34)
  doc.setFont('helvetica', 'normal')
  doc.text(String(prescription.date ?? '—'), 48, 34)

  doc.setFont('helvetica', 'bold')
  doc.text(`Patient:`, 14, 41)
  doc.setFont('helvetica', 'normal')
  doc.text(String(prescription.patientName ?? '—'), 48, 41)

  doc.setFont('helvetica', 'bold')
  doc.text(`Médecin:`, 14, 48)
  doc.setFont('helvetica', 'normal')
  doc.text(String(prescription.doctor ?? '—'), 48, 48)

  doc.setFont('helvetica', 'bold')
  doc.text(`Médicaments:`, 14, 55)
  doc.setFont('helvetica', 'normal')
  const medicLines = doc.splitTextToSize(String(prescription.medicines ?? '—'), 90)
  doc.text(medicLines, 48, 55)

  const afterMedic = 55 + medicLines.length * 6

  doc.setFont('helvetica', 'bold')
  doc.text(`Posologie:`, 14, afterMedic + 4)
  doc.setFont('helvetica', 'normal')
  const dosageLines = doc.splitTextToSize(String(prescription.dosage ?? '—'), 90)
  doc.text(dosageLines, 48, afterMedic + 4)

  const afterDosage = afterMedic + 4 + dosageLines.length * 6

  doc.setDrawColor(...ACCENT)
  doc.setLineWidth(0.5)
  doc.line(14, afterDosage + 6, 134, afterDosage + 6)
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text('Signature du médecin', 80, afterDosage + 20)

  addFooter(doc)
  const patientSlug = (prescription.patientName ?? 'patient').replace(/\s+/g, '-').toLowerCase()
  doc.save(`ordonnance-${patientSlug}-${prescription.date ?? 'date'}.pdf`)
}

// ─── Liste ordonnances ────────────────────────────────────────────────────────
export async function exportPrescriptionListPdf(prescriptions) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  addHeader(doc, 'Historique des ordonnances')

  autoTable(doc, {
    startY: 28,
    head: [['Patient', 'Médecin', 'Médicaments', 'Posologie', 'Date']],
    body: prescriptions.map((p) => [
      p.patientName ?? '—',
      p.doctor ?? '—',
      p.medicines ?? '—',
      p.dosage ?? '—',
      p.date ?? '—',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [235, 245, 255] },
    columnStyles: { 2: { cellWidth: 50 }, 3: { cellWidth: 50 } },
  })

  addFooter(doc)
  doc.save(`ordonnances-${new Date().toISOString().slice(0, 10)}.pdf`)
}
