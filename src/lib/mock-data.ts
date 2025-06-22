export type User = {
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
  avatar: string;
  belt: keyof typeof beltColors;
  stripes: number;
  attendance: {
    total: number;
    lastMonth: number;
  };
  nextGraduationProgress: number;
  affiliation: string;
};

export type Class = {
  id: string;
  name: string;
  time: string;
  instructor: string;
  category: "Adults" | "Kids";
  enrolled: number;
  capacity: number;
};

export type Instructor = {
  id: string;
  name: string;
  avatar: string;
  belt: keyof typeof beltColors;
  bio: string;
  affiliation: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapImage: string;
};

export const beltColors = {
  White: { bg: "bg-white", text: "text-black" },
  Blue: { bg: "bg-blue-600", text: "text-white" },
  Purple: { bg: "bg-purple-600", text: "text-white" },
  Brown: { bg: "bg-yellow-800", text: "text-white" },
  Black: { bg: "bg-black", text: "text-white" },
  "Red/Black": { bg: "bg-gradient-to-r from-red-600 to-black", text: "text-white" },
};

export const allBelts: (keyof typeof beltColors)[] = [ "White", "Blue", "Purple", "Brown", "Black", "Red/Black"];

export const mockUser: User = {
  name: "Alex Costa",
  email: "student@kingsbjj.com",
  role: "student",
  avatar: "https://placehold.co/128x128.png",
  belt: "Purple",
  stripes: 3,
  attendance: {
    total: 124,
    lastMonth: 12,
  },
  nextGraduationProgress: 75,
  affiliation: "Kings BJJ - Downtown",
};

export const mockAttendanceHistory = [
    { date: "2024-07-22", class: "Gi Fundamentals", status: "Present" },
    { date: "2024-07-20", class: "No-Gi Advanced", status: "Present" },
    { date: "2024-07-18", class: "Gi Fundamentals", status: "Present" },
    { date: "2024-07-17", class: "Open Mat", status: "Present" },
    { date: "2024-07-15", class: "Gi Fundamentals", status: "Absent" },
    { date: "2024-07-13", class: "No-Gi Advanced", status: "Present" },
];

export const mockClasses: Class[] = [
  { id: "c1", name: "Gi Fundamentals", time: "18:00 - 19:00", instructor: "Prof. Helio", category: "Adults", enrolled: 18, capacity: 20 },
  { id: "c2", name: "Kids BJJ (5-8y)", time: "17:00 - 17:45", instructor: "Prof. Carla", category: "Kids", enrolled: 10, capacity: 15 },
  { id: "c3", name: "No-Gi Advanced", time: "19:00 - 20:00", instructor: "Prof. Rickson", category: "Adults", enrolled: 12, capacity: 20 },
  { id: "c4", name: "Open Mat", time: "20:00 - 21:00", instructor: "All", category: "Adults", enrolled: 25, capacity: 30 },
  { id: "c5", name: "Kids BJJ (9-12y)", time: "16:00 - 16:45", instructor: "Prof. Carla", category: "Kids", enrolled: 14, capacity: 15 },
];

export const mockInstructors: Instructor[] = [
  { id: "i1", name: "Prof. Helio Gracie", avatar: "https://placehold.co/128x128.png", belt: "Red/Black", bio: "Co-creator of Brazilian Jiu-Jitsu, focusing on leverage and technique.", affiliation: "Kings BJJ - Downtown" },
  { id: "i2", name: "Prof. Rickson Gracie", avatar: "https://placehold.co/128x128.png", belt: "Black", bio: "Renowned for his undefeated record and mastery of fundamentals.", affiliation: "Kings BJJ - Downtown" },
  { id: "i3", name: "Prof. Carla Ribeiro", avatar: "https://placehold.co/128x128.png", belt: "Black", bio: "Specialist in kids training and modern jiu-jitsu techniques.", affiliation: "Kings BJJ - Downtown" },
  { id: "i4", name: "Prof. Fabio Gurgel", avatar: "https://placehold.co/128x128.png", belt: "Black", bio: "Multiple time world champion and an expert strategist.", affiliation: "Kings BJJ - North" },
];

export const mockBranches: Branch[] = [
  { id: "b1", name: "Kings BJJ - Downtown", address: "123 Main St, Anytown, USA", phone: "(555) 123-4567", hours: "Mon-Sat, 9am - 9pm", mapImage: "https://placehold.co/600x400.png" },
  { id: "b2", name: "Kings BJJ - North", address: "456 North Ave, Anytown, USA", phone: "(555) 765-4321", hours: "Mon-Fri, 10am - 8pm", mapImage: "https://placehold.co/600x400.png" },
];
