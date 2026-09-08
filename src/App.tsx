import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { MotivationBanner } from './components/MotivationBanner';
import { CarGoalHero } from './components/CarGoalHero';
import { FinancingBanner } from './components/FinancingBanner';
import { FinancingInquiryModal } from './components/FinancingInquiryModal';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { MilestonesRoadmap } from './components/MilestonesRoadmap';
import { FinancialSummary } from './components/FinancialSummary';
import { AnalyticsView } from './components/AnalyticsView';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { CarCustomizerModal } from './components/CarCustomizerModal';
import { ImpulseCalculatorModal } from './components/ImpulseCalculatorModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { TutorialGuideModal } from './components/TutorialGuideModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatorTerminalModal } from './components/CreatorTerminalModal';
import { LandingAuthPage } from './components/LandingAuthPage';
import { UpgradeModal } from './components/UpgradeModal';
import { CreditDossierModal } from './components/CreditDossierModal';
import { CarCompareModal } from './components/CarCompareModal';
import type { TransactionType } from './types/finance';
import { motion } from 'framer-motion';

const MainAppLayout: React.FC = () => {
  const { currentUser, isCreator, resetTutorial } = useAuth();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalDefaultType, setTxModalDefaultType] = useState<TransactionType>('car_deposit');
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isImpulseModalOpen, setIsImpulseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('signup');
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);
  const [financingInitialCarId, setFinancingInitialCarId] = useState<string | undefined>(undefined);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A) or URL hash #creator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsCreatorModalOpen(true);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#creator' || window.location.hash === '#admin') {
        setIsCreatorModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleOpenTransaction = (type: TransactionType = 'car_deposit') => {
    setTxModalDefaultType(type);
    setIsTxModalOpen(true);
  };

  // If not logged in and not in creator mode, show dedicated Landing & Auth Portal
  if (!currentUser && !isCreator) {
    return (
      <>
        <LandingAuthPage onOpenCreatorModal={() => setIsCreatorModalOpen(true)} />

        {/* Secret Creator Terminal Modal */}
        <CreatorTerminalModal
          isOpen={isCreatorModalOpen}
          onClose={() => {
            setIsCreatorModalOpen(false);
            if (window.location.hash === '#creator' || window.location.hash === '#admin') {
              history.replaceState(null, '', ' ');
            }
          }}
          onSuccess={() => {
            setIsCreatorModalOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B12] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <Navbar
        onOpenTransactionModal={() => handleOpenTransaction('car_deposit')}
        onOpenCarModal={() => setIsCarModalOpen(true)}
        onOpenImpulseModal={() => setIsImpulseModalOpen(true)}
        onOpenEmiCalculator={() => setIsEmiModalOpen(true)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenAuthModal={(tab) => {
          setAuthModalTab(tab || 'signup');
          setIsAuthModalOpen(true);
        }}
        onOpenTutorialModal={() => setIsTutorialModalOpen(true)}
      />

      {/* Main Content Dashboard */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* If Creator Mode Active: Show Creator Control Terminal */}
        {isCreator ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminDashboard />
          </motion.div>
        ) : (
          /* Regular Driver Experience */
          <>
            {/* Daily High-Octane Motivation Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MotivationBanner />
            </motion.div>

            {/* The Flagship Car Goal Hero & Tachometer Speedometer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CarGoalHero
                onOpenCustomDeposit={() => handleOpenTransaction('car_deposit')}
                onOpenCarCustomizer={() => setIsCarModalOpen(true)}
              />
            </motion.div>

            {/* NEW: Car Financing 70% Bank Lease Inquiry Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <FinancingBanner 
                onOpenInquiry={() => {
                  setFinancingInitialCarId(undefined);
                  setIsFinancingModalOpen(true);
                }} 
                onOpenEmiCalculator={() => setIsEmiModalOpen(true)}
              />
            </motion.div>

            {/* 4-Stage Milestones Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MilestonesRoadmap />
            </motion.div>

            {/* Financial Flow Summary & Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <FinancialSummary />
            </motion.div>

            {/* Analytics & Transaction Ledger Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Outflow Analytics */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-5"
              >
                <AnalyticsView />
              </motion.div>

              {/* Transactions Ledger */}
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-7"
              >
                <TransactionList
                  onOpenTransactionModal={() => handleOpenTransaction('income')}
                  onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
                />
              </motion.div>
            </div>
          </>
        )}
      </main>

      {/* Modals & Dialogs */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        defaultType={txModalDefaultType}
      />

      <CarCustomizerModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
      />

      <ImpulseCalculatorModal
        isOpen={isImpulseModalOpen}
        onClose={() => setIsImpulseModalOpen(false)}
      />

      <FinancingInquiryModal
        isOpen={isFinancingModalOpen}
        onClose={() => {
          setIsFinancingModalOpen(false);
          setFinancingInitialCarId(undefined);
        }}
        initialCarId={financingInitialCarId}
        onOpenDossier={() => setIsDossierModalOpen(true)}
      />

      {/* Standalone Auto Lease EMI Calculator Modal */}
      <EmiCalculatorModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        onOpenFinancingInquiry={(carId) => {
          setFinancingInitialCarId(carId);
          setIsEmiModalOpen(false);
          setIsFinancingModalOpen(true);
        }}
      />

      {/* IGNITION TURBO Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onOpenDossier={() => setIsDossierModalOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Bank-Ready Credit Dossier Printable Modal */}
      <CreditDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />

      {/* Multi-Car Comparison Engine Modal */}
      <CarCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      <OnboardingModal />

      <TutorialGuideModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        onRelaunchWizard={() => resetTutorial()}
      />

      {/* Secret Creator Terminal Modal */}
      <CreatorTerminalModal
        isOpen={isCreatorModalOpen}
        onClose={() => {
          setIsCreatorModalOpen(false);
          if (window.location.hash === '#creator' || window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
        onSuccess={() => {
          setIsCreatorModalOpen(false);
        }}
      />

      {/* Automotive Footer with Stealth Creator Access Point */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 mt-12 py-8 bg-white/50 dark:bg-black/20 text-center text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-bold text-slate-700 dark:text-slate-300">
              IGNITION
            </span>
            <span>•</span>
            <span>Target: 8.5 – 9.0 Lacs PKR First Car Downpayment</span>
            {/* Discreet Stealth Creator Access Trigger */}
            <span
              onClick={() => setIsCreatorModalOpen(true)}
              className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity text-slate-400 hover:text-cyan-400 px-1"
              title="•"
            >
              •
            </span>
          </div>
          <p>
            Stay hungry. Stay disciplined. Turn the key.
          </p>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainAppLayout />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
