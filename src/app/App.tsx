import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { QueryProvider } from './providers';
import { FormDataProvider } from '@entities/form-data';
import { ProtectedRoute } from '@shared/ui';
import { WizardLayout } from '@pages/wizard';
import { DoneScreen } from '@pages/done';
import { ConfirmationModal } from '@widgets/confirmation-modal';
import { PersonalForm, AddressForm, LoanForm } from '@widgets/wizard-form';
import { CONFIG } from '@shared/config';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <FormDataProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/step/1" replace />} />

              <Route path="/step" element={<WizardLayout />}>
                <Route path="1" element={<PersonalForm />} />
                <Route path="2" element={<AddressForm />} />
                <Route path="3" element={<LoanForm />} />
              </Route>

              <Route
                path="/confirmation"
                element={
                  <ProtectedRoute requiredStep={CONFIG.STEPS.CONFIRMATION}>
                    <ConfirmationModal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/done"
                element={
                  <ProtectedRoute requiredStep={CONFIG.STEPS.DONE}>
                    <DoneScreen />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </FormDataProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
