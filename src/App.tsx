import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MissionsPage } from './pages/MissionsPage';
import { BrandsPage } from './pages/BrandsPage';
import { ContactPage } from './pages/ContactPage';
import { BrandDashboard } from './pages/BrandDashboard';
import { SignUpPage } from './pages/SignUpPage';
import { UserSignUpPage } from './pages/UserSignUpPage';
import { ChappsAccountPage } from './pages/ChappsAccountPage';
import { UMIPPage } from './pages/UMIPPage';
import { AdsBiddingPlatform } from './components/AdsEngine/AdsBiddingPlatform';
import './styles/animations.css';
import { CreateMissionPage } from './pages/CreateMissionPage';
import { SignInPage } from './pages/SignInPage';
import AccountDeletionPage from './pages/AccountDeletionPage';

function App() {
  // Add error boundary for debugging
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/brand-dashboard" element={<BrandDashboard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user-signup" element={<UserSignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/create-account" element={<ChappsAccountPage />} />
          <Route path="/umip" element={<UMIPPage />} />
          <Route path="/ads-engine" element={<AdsBiddingPlatform />} />
          <Route path="/create-mission" element={<CreateMissionPage />} />
          <Route path="/account-deletion" element={<AccountDeletionPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;