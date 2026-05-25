export interface Course {
  id: string;
  courseId: string;
  regularCourseId: string | null;
  branchId: number;
  title: string;
  type: string;
  duration: number;
  category: string;
  description: string;
  bookable: boolean;
  availableParticipants: number | null;
  bookedParticipants: number | null;
  startDateTime: string; // ISO UTC string
  endDateTime: string;   // ISO UTC string
  special: boolean;
  isSpecial: boolean;
  cancelled: boolean;
  isCancelled: boolean;
  location: string;
}

export interface Branch {
  id: number;
  name: string;
  color: string; // Tailwind bg/text color class base or hex
  colorHex: string;
}

/** One "slot" in the schedule — may aggregate multiple studios at the same start time */
export interface GroupedSession {
  title: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  location: string;
  special: boolean;
  cancelled: boolean;
  /** All branch IDs that offer this course at this exact start time */
  branches: Branch[];
  /** Original Course records, one per branch */
  courses: Course[];
}
