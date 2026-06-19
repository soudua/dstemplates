import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { SuccessPage } from './pages/SuccessPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/template/:id" element={<TemplateDetailPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const ThemedApp: React.FC = () => {
  const { mode } = useTheme();
  return (
    <div className={`theme-root ${mode === 'dark' ? 'theme-dark' : ''}`}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App;
