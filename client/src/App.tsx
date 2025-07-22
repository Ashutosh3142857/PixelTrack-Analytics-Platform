import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import TrackingPixels from "@/pages/TrackingPixels";
import Visitors from "@/pages/Visitors";
import GeographicData from "@/pages/GeographicData";
import LeadForms from "@/pages/LeadForms";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </>
      ) : (
        <>
          <Route path="/">
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
          <Route path="/tracking-pixels">
            <Layout>
              <TrackingPixels />
            </Layout>
          </Route>
          <Route path="/visitors">
            <Layout>
              <Visitors />
            </Layout>
          </Route>
          <Route path="/geographic">
            <Layout>
              <GeographicData />
            </Layout>
          </Route>
          <Route path="/lead-forms">
            <Layout>
              <LeadForms />
            </Layout>
          </Route>
          <Route path="/analytics">
            <Layout>
              <Analytics />
            </Layout>
          </Route>
          <Route path="/reports">
            <Layout>
              <Reports />
            </Layout>
          </Route>
          <Route path="/settings">
            <Layout>
              <Settings />
            </Layout>
          </Route>
          <Route path="/privacy">
            <Layout>
              <Settings />
            </Layout>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
