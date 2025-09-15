"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/select";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Alert, AlertDescription } from "@/components/molecules/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover";
import { AlertCircle, ArrowLeftRight, Check, X } from "lucide-react";
import { useNotationSystem } from "@/features/evaluations/hooks/use-notation-system";
import { GradeValidator, GradeFormatter } from "@/features/evaluations/utils/grade-validator";
import { NotationConverter } from "@/features/evaluations/utils/notation-converter";
import type { NotationSystem } from "@/types/uml-entities";

interface NotationGradeInputProps {
  value?: number | null;
  systemId?: string;
  onChange?: (value: number | null, systemId: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showSystemSelector?: boolean;
  showValidationFeedback?: boolean;
  showConversionHelper?: boolean;
  allowSystemChange?: boolean;
  className?: string;
}

export function NotationGradeInput({
  value,
  systemId,
  onChange,
  onValidationChange,
  placeholder = "Entrez une note",
  disabled = false,
  required = false,
  showSystemSelector = true,
  showValidationFeedback = true,
  showConversionHelper = false,
  allowSystemChange = true,
  className = "",
}: NotationGradeInputProps) {
  const { notationSystems, defaultSystem, loading } = useNotationSystem();
  const [currentSystemId, setCurrentSystemId] = useState(systemId || defaultSystem?.id || "");
  const [inputValue, setInputValue] = useState(value?.toString() || "");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const currentSystem = notationSystems.find(s => s.id === currentSystemId);
  const validator = notationSystems.length > 0 ? new GradeValidator(notationSystems) : null;
  const formatter = notationSystems.length > 0 ? new GradeFormatter(notationSystems) : null;
  const converter = notationSystems.length > 0 ? new NotationConverter(notationSystems) : null;

  // Update local state when props change
  useEffect(() => {
    if (systemId && systemId !== currentSystemId) {
      setCurrentSystemId(systemId);
    }
  }, [systemId, currentSystemId]);

  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  // Validate input when value or system changes
  useEffect(() => {
    if (validator && currentSystem && inputValue) {
      const numValue = Number(inputValue);
      if (!isNaN(numValue)) {
        const result = validator.validateDetailed(numValue, currentSystemId);
        setValidationResult(result);
        onValidationChange?.(result.isValid, result.errors);
      } else {
        setValidationResult({ isValid: false, errors: ["Valeur numérique requise"], warnings: [], info: [] });
        onValidationChange?.(false, ["Valeur numérique requise"]);
      }
    } else {
      setValidationResult(null);
      onValidationChange?.(true, []);
    }
  }, [inputValue, currentSystemId, validator, currentSystem, onValidationChange]);

  const handleValueChange = (newValue: string) => {
    setInputValue(newValue);

    if (newValue === "") {
      onChange?.(null, currentSystemId);
      return;
    }

    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      onChange?.(numValue, currentSystemId);
    }
  };

  const handleSystemChange = (newSystemId: string) => {
    if (!allowSystemChange) return;

    const newSystem = notationSystems.find(s => s.id === newSystemId);
    if (!newSystem || !currentSystem || !inputValue) {
      setCurrentSystemId(newSystemId);
      onChange?.(value ?? null, newSystemId);
      return;
    }

    // Try to convert the current value to the new system
    if (converter && value !== null && value !== undefined) {
      try {
        const conversionResult = converter.convert(value, currentSystemId, newSystemId);
        setCurrentSystemId(newSystemId);
        setInputValue(conversionResult.value.toString());
        onChange?.(conversionResult.value, newSystemId);
      } catch (error) {
        // Conversion failed, just change system
        setCurrentSystemId(newSystemId);
        onChange?.(null, newSystemId);
        setInputValue("");
      }
    } else {
      setCurrentSystemId(newSystemId);
      onChange?.(value ?? null, newSystemId);
    }
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;

    if (validationResult.isValid) {
      return <Check className="w-4 h-4 text-green-500" />;
    } else {
      return <X className="w-4 h-4 text-red-500" />;
    }
  };

  const getFormattedPreview = () => {
    if (!formatter || !currentSystem || !inputValue) return null;

    const numValue = Number(inputValue);
    if (isNaN(numValue)) return null;

    try {
      const formatted = formatter.format(numValue, currentSystemId, {
        showDescription: true,
        colorCoded: false,
      });
      return formatted;
    } catch {
      return null;
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        {/* Grade Input */}
        <div className="flex-1 relative">
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={currentSystem?.minValue}
            max={currentSystem?.maxValue}
            step={currentSystem?.rules && (currentSystem.rules as any).precision || 0.5}
            className={`pr-8 ${validationResult && !validationResult.isValid ? 'border-red-500' : ''}`}
          />
          {getValidationIcon() && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {getValidationIcon()}
            </div>
          )}
        </div>

        {/* System Selector */}
        {showSystemSelector && (
          <div className="w-48">
            <Select
              value={currentSystemId}
              onValueChange={handleSystemChange}
              disabled={!allowSystemChange || disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {notationSystems.map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    <div className="flex items-center gap-2">
                      <span>{system.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {system.scaleType}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Converter Helper */}
        {showConversionHelper && converter && (
          <Popover open={isConverterOpen} onOpenChange={setIsConverterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ConversionHelper
                converter={converter}
                systems={notationSystems}
                currentValue={value}
                currentSystemId={currentSystemId}
                onConvert={(newValue, newSystemId) => {
                  setInputValue(newValue.toString());
                  setCurrentSystemId(newSystemId);
                  onChange?.(newValue, newSystemId);
                  setIsConverterOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* System Info */}
      {currentSystem && (
        <div className="text-xs text-muted-foreground">
          Échelle: {currentSystem.minValue} - {currentSystem.maxValue}
          {currentSystem.rules && (currentSystem.rules as any).precision && (
            <span> • Précision: {(currentSystem.rules as any).precision}</span>
          )}
        </div>
      )}

      {/* Formatted Preview */}
      {getFormattedPreview() && (
        <div className="text-sm">
          <span className="text-muted-foreground">Aperçu: </span>
          <Badge variant="outline">
            {getFormattedPreview()?.display}
          </Badge>
          {getFormattedPreview()?.description && (
            <span className="ml-2 text-muted-foreground">
              {getFormattedPreview()?.description}
            </span>
          )}
        </div>
      )}

      {/* Validation Feedback */}
      {showValidationFeedback && validationResult && !validationResult.isValid && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationResult.errors.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {showValidationFeedback && validationResult && validationResult.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationResult.warnings.map((warning: string, index: number) => (
                <li key={index} className="text-orange-600">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Conversion Helper Component
function ConversionHelper({
  converter,
  systems,
  currentValue,
  currentSystemId,
  onConvert,
}: {
  converter: NotationConverter;
  systems: NotationSystem[];
  currentValue: number | null | undefined;
  currentSystemId: string;
  onConvert: (value: number, systemId: string) => void;
}) {
  const [targetSystemId, setTargetSystemId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [conversionResult, setConversionResult] = useState<any>(null);

  const handleConvert = () => {
    if (!inputValue || !targetSystemId) return;

    const sourceSystemId = currentSystemId;
    const numValue = Number(inputValue);

    if (isNaN(numValue)) return;

    try {
      const result = converter.convert(numValue, sourceSystemId, targetSystemId);
      setConversionResult(result);
    } catch (error) {
      console.error("Erreur de conversion:", error);
    }
  };

  const handleApplyConversion = () => {
    if (conversionResult) {
      onConvert(conversionResult.value, targetSystemId);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Convertir une note</h4>
        <p className="text-sm text-muted-foreground">
          Convertissez une note d'un autre système vers le système actuel
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Système source</Label>
          <Select value={targetSystemId} onValueChange={setTargetSystemId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un système" />
            </SelectTrigger>
            <SelectContent>
              {systems
                .filter(s => s.id !== currentSystemId)
                .map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Note à convertir</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Note source"
            />
            <Button onClick={handleConvert} disabled={!inputValue || !targetSystemId}>
              Convertir
            </Button>
          </div>
        </div>

        {conversionResult && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Résultat:</span>
              <Badge variant="outline">
                {conversionResult.value}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Confiance: {(conversionResult.confidence * 100).toFixed(1)}%
              {!conversionResult.isExact && " (approximatif)"}
            </div>
            <Button onClick={handleApplyConversion} size="sm" className="w-full">
              Utiliser cette note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}