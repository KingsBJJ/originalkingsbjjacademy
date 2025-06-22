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
  Branca: { bg: "bg-white", text: "text-black" },
  Azul: { bg: "bg-blue-600", text: "text-white" },
  Roxa: { bg: "bg-purple-600", text: "text-white" },
  Marrom: { bg: "bg-yellow-800", text: "text-white" },
  Preta: { bg: "bg-black", text: "text-white" },
  Coral: { bg: "bg-gradient-to-r from-red-600 to-black", text: "text-white" },
};

export const allBelts: (keyof typeof beltColors)[] = [ "Branca", "Azul", "Roxa", "Marrom", "Preta", "Coral"];

export const mockUser: User = {
  name: "Alex Costa",
  email: "student@kingsbjj.com",
  role: "student",
  avatar: "https://placehold.co/128x128.png",
  belt: "Roxa",
  stripes: 3,
  attendance: {
    total: 124,
    lastMonth: 12,
  },
  nextGraduationProgress: 75,
  affiliation: "Kings BJJ - Centro",
};

export const mockAttendanceHistory = [
    { date: "2024-07-22", class: "Fundamentos de Kimono", status: "Presente" },
    { date: "2024-07-20", class: "Sem Kimono - Avançado", status: "Presente" },
    { date: "2024-07-18", class: "Fundamentos de Kimono", status: "Presente" },
    { date: "2024-07-17", class: "Treino Livre", status: "Presente" },
    { date: "2024-07-15", class: "Fundamentos de Kimono", status: "Ausente" },
    { date: "2024-07-13", class: "Sem Kimono - Avançado", status: "Presente" },
];

export const mockClasses: Class[] = [
  { id: "c1", name: "Fundamentos de Kimono", time: "18:00 - 19:00", instructor: "Prof. Helio", category: "Adults", enrolled: 18, capacity: 20 },
  { id: "c2", name: "Jiu-Jitsu Kids (5-8 anos)", time: "17:00 - 17:45", instructor: "Profa. Carla", category: "Kids", enrolled: 10, capacity: 15 },
  { id: "c3", name: "Sem Kimono - Avançado", time: "19:00 - 20:00", instructor: "Prof. Rickson", category: "Adults", enrolled: 12, capacity: 20 },
  { id: "c4", name: "Treino Livre", time: "20:00 - 21:00", instructor: "Todos", category: "Adults", enrolled: 25, capacity: 30 },
  { id: "c5", name: "Jiu-Jitsu Kids (9-12 anos)", time: "16:00 - 16:45", instructor: "Profa. Carla", category: "Kids", enrolled: 14, capacity: 15 },
];

export const mockInstructors: Instructor[] = [
  { id: "i1", name: "Prof. Helio Gracie", avatar: "https://placehold.co/128x128.png", belt: "Coral", bio: "Co-criador do Jiu-Jitsu Brasileiro, com foco em alavancagem e técnica.", affiliation: "Kings BJJ - Centro" },
  { id: "i2", name: "Prof. Rickson Gracie", avatar: "https://placehold.co/128x128.png", belt: "Preta", bio: "Conhecido por seu recorde invicto e domínio dos fundamentos.", affiliation: "Kings BJJ - Centro" },
  { id: "i3", name: "Profa. Carla Ribeiro", avatar: "https://placehold.co/128x128.png", belt: "Preta", bio: "Especialista em treino infantil e técnicas modernas de jiu-jitsu.", affiliation: "Kings BJJ - Centro" },
  { id: "i4", name: "Prof. Fabio Gurgel", avatar: "https://placehold.co/128x128.png", belt: "Preta", bio: "Múltiplo campeão mundial e um estrategista especialista.", affiliation: "Kings BJJ - Norte" },
];

export const mockBranches: Branch[] = [
  { id: "b1", name: "Kings BJJ - Centro", address: "Rua Principal 123, Cidade, BR", phone: "(55) 1234-5678", hours: "Seg-Sáb, 9h - 21h", mapImage: "https://placehold.co/600x400.png" },
  { id: "b2", name: "Kings BJJ - Norte", address: "Avenida Norte 456, Cidade, BR", phone: "(55) 8765-4321", hours: "Seg-Sex, 10h - 20h", mapImage: "https://placehold.co/600x400.png" },
];
