import type { TimeSlot } from "@/types/uml-entities";

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  {
    id: "slot-8h30-9h25",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "8h30-9h25",
    startTime: "08:30",
    endTime: "09:25",
    durationMinutes: 55,
    displayOrder: 1,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-9h30-10h25",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "9h30-10h25",
    startTime: "09:30",
    endTime: "10:25",
    durationMinutes: 55,
    displayOrder: 2,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-10h40-11h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "10h40-11h35",
    startTime: "10:40",
    endTime: "11:35",
    durationMinutes: 55,
    displayOrder: 3,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-11h40-12h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "11h40-12h35",
    startTime: "11:40",
    endTime: "12:35",
    durationMinutes: 55,
    displayOrder: 4,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-12h40-13h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "12h40-13h35",
    startTime: "12:40",
    endTime: "13:35",
    durationMinutes: 55,
    displayOrder: 5,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-13h40-14h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "13h40-14h35",
    startTime: "13:40",
    endTime: "14:35",
    durationMinutes: 55,
    displayOrder: 6,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-14h40-15h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "14h40-15h35",
    startTime: "14:40",
    endTime: "15:35",
    durationMinutes: 55,
    displayOrder: 7,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
  {
    id: "slot-15h40-16h35",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "15h40-16h35",
    startTime: "15:40",
    endTime: "16:35",
    durationMinutes: 55,
    displayOrder: 8,
    isBreak: false,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    overlaps: function (other: TimeSlot): boolean {
      const thisStart = parseInt(this.startTime.replace(":", ""), 10);
      const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
      const otherStart = parseInt(other.startTime.replace(":", ""), 10);
      const otherEnd = parseInt(other.endTime.replace(":", ""), 10);

      return thisStart < otherEnd && thisEnd > otherStart;
    },
    getDuration: function (): number {
      return this.durationMinutes;
    },
  },
];

// Helper functions
export const getTimeSlotById = (id: string): TimeSlot | undefined => {
  return MOCK_TIME_SLOTS.find((timeSlot) => timeSlot.id === id);
};

export const getActiveTimeSlots = (): TimeSlot[] => {
  return MOCK_TIME_SLOTS.filter((slot) => !slot.isBreak);
};

export const getTimeSlotsByOrder = (): TimeSlot[] => {
  return MOCK_TIME_SLOTS.sort((a, b) => a.displayOrder - b.displayOrder);
};
