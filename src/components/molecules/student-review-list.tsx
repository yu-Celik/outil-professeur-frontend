"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { CheckCircle, Circle, Edit3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";

export interface StudentReviewItem {
  id: string;
  name: string;
  isValidated: boolean;
  isModified: boolean;
}

export interface StudentReviewListProps {
  students: StudentReviewItem[];
  selectedStudentId?: string;
  onSelectStudent: (studentId: string) => void;
  stats?: {
    total: number;
    validated: number;
    modified: number;
    remaining: number;
    progress: number;
  };
}

export function StudentReviewList({
  students,
  selectedStudentId,
  onSelectStudent,
  stats,
}: StudentReviewListProps) {
  return (
    <Card className="h-full flex flex-col border-0 rounded-none">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base">Élèves à réviser</CardTitle>
        {stats && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">
                {stats.validated}/{stats.total}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>{stats.validated} validés</span>
              </div>
              <div className="flex items-center gap-1">
                <Edit3 className="h-3 w-3 text-amber-500" />
                <span>{stats.modified} modifiés</span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto p-0">
        <div className="space-y-0.5 p-2">
          {students.map((student) => (
            <Button
              key={student.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto py-2 px-3 rounded-md",
                selectedStudentId === student.id &&
                  "bg-primary/10 text-primary font-medium hover:bg-primary/15",
              )}
              onClick={() => onSelectStudent(student.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="flex-shrink-0">
                  {student.isValidated ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left truncate">
                  <div className="text-sm truncate">{student.name}</div>
                </div>
                {student.isModified && !student.isValidated && (
                  <Badge
                    variant="outline"
                    className="ml-auto flex-shrink-0 text-xs"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Modifié
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
