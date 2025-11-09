import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      if (!isAuthenticated && location !== "/") {
        hasRedirected.current = true;
        setLocation("/");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        hasRedirected.current = true;
        if (user.role === "admin" && location !== "/admin") {
          setLocation("/admin");
        } else if (user.role === "vendor" && location !== "/vendor") {
          setLocation("/vendor");
        } else if (user.role === "student" && location !== "/student") {
          setLocation("/student");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" data-testid="loading-spinner" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
