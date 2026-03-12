import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AppLogo from './components/AppLogo.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MemberPortal from './pages/MemberPortal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import {
  createApplicationRecord,
  createMemberFromApplication,
  downloadTextFile,
  loadPlatformState,
  persistPlatformState,
  serializeMembersCsv,
} from './lib/platformStore.js'

function AppShell() {
  const [platformState, setPlatformState] = useState(() => loadPlatformState())
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    persistPlatformState(platformState)
  }, [platformState])

  const overviewStats = useMemo(() => {
    const approvedMembers = platformState.members.length
    const pendingApplications = platformState.applications.filter(
      (application) => application.status === 'pending',
    ).length
    const verifiedPayments = platformState.applications.filter(
      (application) => application.paymentVerified,
    ).length

    return {
      approvedMembers,
      pendingApplications,
      verifiedPayments,
      totalContribution: approvedMembers * platformState.settings.feeAmount,
    }
  }, [platformState])

  const handleApplicationSubmit = (formData) => {
    setPlatformState((currentState) => {
      const nextApplication = createApplicationRecord(formData, currentState)

      return {
        ...currentState,
        applications: [nextApplication, ...currentState.applications],
        notifications: [
          {
            id: `notification-${Date.now()}`,
            scope: 'public',
            title: "Demande d'adhésion enregistrée",
            message:
              "Merci pour votre inscription. Votre demande d'adhésion a été enregistrée avec succès. Votre carte de membre sera disponible dans un délai maximum de 48 heures.",
            date: new Date().toISOString(),
          },
          ...currentState.notifications,
        ],
      }
    })
  }

  const handlePaymentVerification = (applicationId) => {
    setPlatformState((currentState) => ({
      ...currentState,
      applications: currentState.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              paymentVerified: !application.paymentVerified,
              paymentReviewedAt: new Date().toISOString(),
            }
          : application,
      ),
    }))
  }

  const handleApproveApplication = (applicationId) => {
    setPlatformState((currentState) => {
      const application = currentState.applications.find(
        (entry) => entry.id === applicationId,
      )

      if (!application || application.status !== 'pending' || !application.paymentVerified) {
        return currentState
      }

      const nextMember = createMemberFromApplication(application, currentState)

      return {
        ...currentState,
        applications: currentState.applications.map((entry) =>
          entry.id === applicationId
            ? {
                ...entry,
                status: 'approved',
                memberId: nextMember.id,
                reviewedAt: new Date().toISOString(),
              }
            : entry,
        ),
        members: [nextMember, ...currentState.members],
        notifications: [
          {
            id: `notification-${Date.now()}`,
            scope: 'member',
            memberId: nextMember.id,
            title: 'Carte virtuelle disponible',
            message:
              'Votre adhésion a été validée. Votre carte virtuelle est maintenant accessible depuis votre espace personnel.',
            date: new Date().toISOString(),
          },
          ...currentState.notifications,
        ],
      }
    })
  }

  const handleRejectApplication = (applicationId) => {
    setPlatformState((currentState) => ({
      ...currentState,
      applications: currentState.applications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
            }
          : application,
      ),
    }))
  }

  const handleUpdateMember = (memberId, updates) => {
    setPlatformState((currentState) => ({
      ...currentState,
      members: currentState.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : member,
      ),
    }))
  }

  const handleExportMembers = () => {
    const csv = serializeMembersCsv(platformState.members)
    downloadTextFile('liste-membres-acd.csv', csv, 'text/csv;charset=utf-8')
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <AppLogo />
            <div>
              <p className="app-kicker">Plateforme de gestion politique</p>
            </div>
          </div>
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={mobileNavOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
            <span>Menu</span>
          </button>
          <nav
            id="main-navigation"
            className={`app-nav ${mobileNavOpen ? 'open' : ''}`}
            aria-label="Navigation principale"
          >
            <NavLink to="/" end onClick={() => setMobileNavOpen(false)}>
              Accueil
            </NavLink>
            <NavLink to="/espace-membre" onClick={() => setMobileNavOpen(false)}>
              Espace membre
            </NavLink>
            <NavLink to="/administration" onClick={() => setMobileNavOpen(false)}>
              Administration
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  settings={platformState.settings}
                  stats={overviewStats}
                  onApplicationSubmit={handleApplicationSubmit}
                />
              }
            />
            <Route
              path="/espace-membre"
              element={
                <MemberPortal
                  members={platformState.members}
                  notifications={platformState.notifications}
                  settings={platformState.settings}
                  onUpdateMember={handleUpdateMember}
                />
              }
            />
            <Route
              path="/administration"
              element={
                <AdminDashboard
                  applications={platformState.applications}
                  members={platformState.members}
                  settings={platformState.settings}
                  onApprove={handleApproveApplication}
                  onExport={handleExportMembers}
                  onReject={handleRejectApplication}
                  onTogglePayment={handlePaymentVerification}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default AppShell
