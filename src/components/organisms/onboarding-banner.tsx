"use client";

import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Info, X } from "lucide-react";

interface OnboardingBannerProps {
  step: number;
  totalSteps: number;
  message: string;
  onSkip?: () => void;
  onConfirm?: () => void;
}

export function OnboardingBanner({
  step,
  totalSteps,
  message,
  onSkip,
  onConfirm,
}: OnboardingBannerProps) {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="border border-destructive/20 bg-destructive/5 text-card-foreground rounded-lg p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <Info className="h-5 w-5 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">{message}</p>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-destructive/20 rounded-full">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <Badge variant="destructive">
                {step}/{totalSteps}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/80"
            onClick={onSkip}
          >
            Passer
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Continuer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive/80"
            onClick={onSkip}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
