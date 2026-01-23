import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { BudgetPage } from './pages/BudgetPage';
import { NearbyAirportsPage } from './pages/NearbyAirportsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
function AppLayout({ children }: {children: React.ReactNode;}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>);

}
function AuthLayout({ children }: {children: React.ReactNode;}) {
  return <>{children}</>;
}
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (no nav/footer) */}
        <Route
          path="/login"
          element={
          <AuthLayout>
              <LoginPage />
            </AuthLayout>
          } />

        <Route
          path="/signup"
          element={
          <AuthLayout>
              <SignupPage />
            </AuthLayout>
          } />


        {/* Main pages (with nav/footer) */}
        <Route
          path="/"
          element={
          <AppLayout>
              <LandingPage />
            </AppLayout>
          } />

        <Route
          path="/search"
          element={
          <AppLayout>
              <SearchPage />
            </AppLayout>
          } />

        <Route
          path="/destinations"
          element={
          <AppLayout>
              <DestinationsPage />
            </AppLayout>
          } />

        <Route
          path="/destinations/:id"
          element={
          <AppLayout>
              <DestinationDetailPage />
            </AppLayout>
          } />

        <Route
          path="/budget"
          element={
          <AppLayout>
              <BudgetPage />
            </AppLayout>
          } />

        <Route
          path="/nearby"
          element={
          <AppLayout>
              <NearbyAirportsPage />
            </AppLayout>
          } />

        <Route
          path="/profile"
          element={
          <AppLayout>
              <ProfilePage />
            </AppLayout>
          } />

      </Routes>
    </BrowserRouter>);

}