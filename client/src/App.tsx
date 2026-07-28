import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import RequisitionHistory from "./pages/RequisitionHistory";

// ฟังก์ชันดึง path ปัจจุบันโดยตัด Base path ออกอัตโนมัติ
const useGHLocation = () => {
  const base = "/WEB-VMO";
  const [location, setLocation] = useState(() => {
    const path = window.location.pathname;
    return path.startsWith(base) ? path.slice(base.length) || "/" : path;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setLocation(path.startsWith(base) ? path.slice(base.length) || "/" : path);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [base]);

  const navigate = (to: string) => {
    const target = base + (to.startsWith("/") ? to : "/" + to);
    window.history.pushState(null, "", target);
    setLocation(to);
  };

  return [location, navigate] as const;
};

import { useState, useEffect } from "react";

function Router() {
  return (
    <WouterRouter hook={useGHLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/history" component={RequisitionHistory} />
        <Route path="/404" component={NotFound} />
        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
