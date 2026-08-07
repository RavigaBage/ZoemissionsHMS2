import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { NewPatientPage } from './pages/NewPatientPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { NewEncounterPage } from './pages/NewEncounterPage';
import { NewVitalsPage } from './pages/NewVitalsPage';
import { NewConsultationPage } from './pages/NewConsultationPage';
import { ConsultationDetailPage } from './pages/ConsultationDetailPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { DispensingPage } from './pages/DispensingPage';
import { QueuePage } from './pages/QueuePage';
import { VitalsPage } from './pages/VitalsPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { DispensingHistoryPage } from './pages/DispensingHistoryPage';
import { StaffPage } from './pages/StaffPage';
import { SettingsPage } from './pages/SettingsPage';

// Help Pages
import { HelpPage } from './pages/help/HelpPage';
import { HelpTutorialsPage } from './pages/help/HelpTutorialsPage';
import { HelpDocsPage } from './pages/help/HelpDocsPage';
import { HelpFaqPage } from './pages/help/HelpFaqPage';
import { HelpContactPage } from './pages/help/HelpContactPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
          {/* Public Routes without AppLayout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes wrapped in AppLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={['registration', 'triage', 'doctor', 'admin']}>
                <AppLayout>
                  <PatientsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/new"
            element={
              <ProtectedRoute allowedRoles={['registration', 'admin']}>
                <AppLayout>
                  <NewPatientPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute allowedRoles={['registration', 'triage', 'doctor', 'admin']}>
                <AppLayout>
                  <PatientDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/encounters/new"
            element={
              <ProtectedRoute allowedRoles={['registration', 'triage', 'admin']}>
                <AppLayout>
                  <NewEncounterPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vitals/new"
            element={
              <ProtectedRoute allowedRoles={['triage', 'doctor', 'admin']}>
                <AppLayout>
                  <NewVitalsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultations/new"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <AppLayout>
                  <NewConsultationPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultations/:id"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <AppLayout>
                  <ConsultationDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/medications"
            element={
              <ProtectedRoute allowedRoles={['pharmacy', 'doctor', 'admin']}>
                <AppLayout>
                  <MedicationsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['pharmacy', 'doctor', 'admin']}>
                <AppLayout>
                  <PrescriptionsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dispensing"
            element={
              <ProtectedRoute allowedRoles={['pharmacy', 'admin']}>
                <AppLayout>
                  <DispensingPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dispensing/history"
            element={
              <ProtectedRoute allowedRoles={['pharmacy', 'admin']}>
                <AppLayout>
                  <DispensingHistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute allowedRoles={['registration', 'triage', 'doctor', 'pharmacy', 'admin']}>
                <AppLayout>
                  <QueuePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vitals"
            element={
              <ProtectedRoute allowedRoles={['triage', 'doctor', 'admin']}>
                <AppLayout>
                  <VitalsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <AppLayout>
                  <ConsultationsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <StaffPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Help Routes */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HelpPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/help/tutorials"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HelpTutorialsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/help/docs"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HelpDocsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/help/faq"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HelpFaqPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/help/contact"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HelpContactPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
  );
}

export default App;
