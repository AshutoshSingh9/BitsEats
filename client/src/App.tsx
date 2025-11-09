import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import VendorMenu from "@/pages/vendor-menu";
import Checkout from "@/pages/checkout";
import OrderTracking from "@/pages/order-tracking";
import VendorDashboard from "@/pages/vendor-dashboard";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/vendor/:id" component={VendorMenu} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders/:id" component={OrderTracking} />
      <Route path="/vendor/dashboard" component={VendorDashboard} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
