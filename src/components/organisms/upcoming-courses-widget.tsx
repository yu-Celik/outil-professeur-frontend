"use client";

import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

interface UpcomingCourse {
  id: string;
  class: string;
  time: string;
  duration: string;
}

interface UpcomingCoursesWidgetProps {
  courses: UpcomingCourse[];
  onSortChange?: (sortBy: string) => void;
  onCalendarClick?: () => void;
}

export function UpcomingCoursesWidget({
  courses,
  onSortChange,
  onCalendarClick,
}: UpcomingCoursesWidgetProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Prochains cours
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Heure</SelectItem>
              <SelectItem value="class">Classe</SelectItem>
              <SelectItem value="duration">Durée</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onCalendarClick}>
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-2 overflow-y-auto">
          {courses.map((course) => (
            <Button
              key={course.id}
              size="lg"
              variant="outline"
              className="flex justify-between gap-4 w-full"
            >
              <div className="space-x-4">
                <Badge variant="outline">{course.class}</Badge>
                <span className="font-medium">{course.time}</span>
              </div>
              <Badge variant="secondary">{course.duration}</Badge>
            </Button>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun cours programmé
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
