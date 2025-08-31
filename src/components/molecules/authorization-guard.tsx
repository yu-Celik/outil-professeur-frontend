"use client";

import { AlertTriangle, Lock, Shield } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";

interface AuthorizationGuardProps {
  hasPermission: boolean;
  children: React.ReactNode;
  fallbackMessage?: string;
  requiredRole?: string;
  className?: string;
}

export function AuthorizationGuard({
  hasPermission,
  children,
  fallbackMessage = "Accès non autorisé",
  requiredRole,
  className = "",
}: AuthorizationGuardProps) {
  if (!hasPermission) {
    return (
      <Card className={`border-chart-4/20 bg-chart-4/5 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-chart-4/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-chart-4" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <span className="font-medium text-chart-4">
                  {fallbackMessage}
                </span>
              </div>

              {requiredRole && (
                <Badge
                  variant="outline"
                  className="text-chart-4 bg-chart-4/20 border-chart-4/30"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Rôle requis: {requiredRole}
                </Badge>
              )}

              <p className="text-sm text-chart-4 max-w-md">
                Vous n'avez pas les permissions nécessaires pour accéder à cette
                section. Contactez l'administrateur si vous pensez qu'il s'agit
                d'une erreur.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
