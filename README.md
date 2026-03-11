# Systeme Post-Sante

Application web de gestion interne pour un poste de sante au Senegal.

## Stack technique

- React.js
- CSS pur (fichiers separes par composant)
- Vite

## Modules inclus

- Dashboard
- Patients
- Ordonnances
- Pharmacie
- Tickets de caisse
- Comptabilite
- Personnel
- Parametres et journal des entrees

## Structure du projet

```text
src/
	data/
		seedData.js
	layout/
		Navbar.jsx
		Navbar.css
		Sidebar.jsx
		Sidebar.css
	pages/
		Dashboard.jsx
		Dashboard.css
		Patients.jsx
		Patients.css
		Prescriptions.jsx
		Prescriptions.css
		Pharmacy.jsx
		Pharmacy.css
		Tickets.jsx
		Tickets.css
		Accounting.jsx
		Accounting.css
		Staff.jsx
		Staff.css
		Settings.jsx
		Settings.css
	App.jsx
	App.css
	index.css
```

## Demarrage

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Configuration Supabase

1. Utilise ton projet Supabase existant (plateforme de formation).
2. Copie `.env.example` vers `.env`.
3. Renseigne les variables:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. Ouvre SQL Editor dans Supabase et execute `supabase/schema.sql`.
5. Redemarre l'application (`npm run dev`).

Les tables du module sante sont prefixees `health_` pour eviter les conflits avec les tables de ta plateforme de formation.

Si les variables ne sont pas configurees, l'application fonctionne en mode local avec les donnees seed.
