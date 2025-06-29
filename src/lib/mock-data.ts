export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
  avatar: string;
  belt: keyof typeof beltColors | keyof typeof beltColorsKids;
  stripes: number;
  attendance: {
    total: number;
    lastMonth: number;
  };
  nextGraduationProgress: number;
  affiliation: string;
  branchId: string;
  category: "Adult" | "Kids";
};

export type Class = {
  id: string;
  name: string;
  time: string;
  instructor: string;
  category: "Adults" | "Kids";
  enrolled: number;
  capacity: number;
  branchId: string;
};

export type Instructor = {
  id: string;
  name: string;
  avatar: string;
  belt: keyof typeof beltColors;
  stripes: number;
  bio: string;
  affiliation: string;
  email: string;
  phone: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  responsible: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
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

export const beltInfo = {
  Branca: {
    description: "Foco nos fundamentos, sobrevivência e defesa. O início da jornada.",
    skills: ["Postura na Guarda", "Fuga de Quadril", "Rolamentos", "Levantada Técnica", "Defesa de Estrangulamento", "Pegada Básica", "Amortecimento de Queda", "Controle de 100kg", "Raspagem de Gancho", "Finalização da Montada"],
  },
  Azul: {
    description: "Expansão do repertório de técnicas, começo do ataque e combinações.",
    skills: ["Americana da Montada", "Armlock da Guarda", "Kimura", "Guarda Fechada", "Passagem de Guarda de Joelhos", "Estrangulamento Cruzado", "Raspagem de Tesoura", "Triângulo", "Defesa de Passagem", "Controle Lateral"],
  },
  Roxa: {
    description: "Desenvolvimento de um jogo próprio, refinamento técnico e estratégia.",
    skills: ["Triângulo", "Ataques das Costas", "Guarda De La Riva", "Guarda Aranha", "Berimbolo", "Controle Lateral", "Passagem de Meia Guarda", "Omoplata", "Leg Drag", "Chave de Pé Reta"],
  },
  Marrom: {
    description: "Consolidação da técnica, alta eficiência e preparação para a faixa preta.",
    skills: ["Chaves de Pé Retas", "Passagens de Guarda em Pé", "Omoplata", "Jogo de Pressão", "Controle do Kesa-Gatame", "Leg Drag", "Finalizações da Montada", "Relógio", "Estrangulamento Ezequiel", "Ataques no 50/50"],
  },
  Preta: {
    description: "Maestria dos fundamentos e liderança. A faixa preta possui 6 graus antes da faixa coral, representando a jornada de aprendizado, ensino e contribuição para a arte.",
    skills: ["1º a 3º Grau (Professor)", "4º a 6º Grau (Mestre)", "Liderança e Mentoria", "Domínio Técnico", "Estratégia Avançada", "Desenvolvimento de Alunos", "Contribuição à Comunidade", "Arbitragem e Regras", "História do Jiu-Jitsu", "Primeiros Socorros"],
  },
  Coral: {
    description: "Representa o 7º grau da faixa preta. Anos de dedicação e contribuição ao esporte, um grande mestre.",
    skills: ["Legado no Esporte", "Filosofia do Jiu-Jitsu", "Contribuição para a Comunidade", "Desenvolvimento de Mestres", "Grande Mestria", "Impacto na Arte", "Visão Estratégica", "Embaixador da Arte", "Mentor de Gerações", "Inovação Técnica"],
  },
};

// --- Sistema de Graduação Infantil ---

export const beltColorsKids = {
  Branca: { bg: "bg-white", text: "text-black" },
  Cinza: { bg: "bg-gray-500", text: "text-white" },
  Amarela: { bg: "bg-yellow-500", text: "text-black" },
  Laranja: { bg: "bg-orange-500", text: "text-white" },
  Verde: { bg: "bg-green-600", text: "text-white" },
};

export const allBeltsKids: (keyof typeof beltColorsKids)[] = ["Branca", "Cinza", "Amarela", "Laranja", "Verde"];

export const beltInfoKids = {
  Branca: {
    description: "Foco em respeito, disciplina e movimentos básicos como rolamentos e quedas seguras.",
    skills: ["Respeito ao Tatame", "Disciplina", "Rolamento para Frente", "Rolamento para Trás", "Amortecimento de Queda"],
  },
  Cinza: {
    description: "Introdução às posições básicas de controle e conceitos de imobilização.",
    skills: ["Posição de Montada", "Controle de 100kg", "Fuga de Quadril Básica", "Pegada de Judô", "Postura na Guarda"],
  },
  Amarela: {
    description: "Primeiras finalizações seguras e raspagens, começando a conectar movimentos ofensivos.",
    skills: ["Armlock da Montada", "Estrangulamento pela Gola", "Raspagem de Gancho", "Passagem de Guarda Simples", "Defesa Pessoal Básica"],
  },
  Laranja: {
    description: "Maior repertório de ataques e defesas, e o desenvolvimento de combinações simples.",
    skills: ["Triângulo da Montada", "Ataque Duplo (Raspagem + Finalização)", "Guarda Aranha Básica", "Quedas Simples (O-Goshi)", "Controle das Costas"],
  },
  Verde: {
    description: "Transição para técnicas mais avançadas, preparando para o sistema de graduação adulto.",
    skills: ["Kimura da Guarda", "Passagem de Guarda Toreando", "De La Riva Básica", "Defesa de Chaves de Braço", "Início do Jogo Estratégico"],
  },
};

const studentUser: User = {
  id: "user1",
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
  branchId: "b1",
  category: "Adult",
};

const professorUser: User = {
    id: "user2",
    name: "Prof. Rickson Gracie",
    email: "professor@kingsbjj.com",
    role: "professor",
    avatar: "https://placehold.co/128x128.png",
    belt: "Preta",
    stripes: 6,
    attendance: {
      total: 1024,
      lastMonth: 20,
    },
    nextGraduationProgress: 100,
    affiliation: "Kings BJJ - Centro",
    branchId: "b1",
    category: "Adult",
};

const adminUser: User = {
    id: "user3",
    name: "Admin Geral",
    email: "admin@kingsbjj.com",
    role: "admin",
    avatar: "https://placehold.co/128x128.png",
    belt: "Preta",
    stripes: 6,
    attendance: {
      total: 999,
      lastMonth: 99,
    },
    nextGraduationProgress: 100,
    affiliation: "Todas as Filiais",
    branchId: "all",
    category: "Adult",
};

export const mockUsers = {
    student: studentUser,
    professor: professorUser,
    admin: adminUser,
}

export const mockAttendanceHistory = [
    { date: "2024-07-22", class: "Fundamentos de Kimono", status: "Presente" },
    { date: "2024-07-20", class: "Sem Kimono - Avançado", status: "Presente" },
    { date: "2024-07-18", class: "Fundamentos de Kimono", status: "Presente" },
    { date: "2024-07-17", class: "Treino Livre", status: "Presente" },
    { date: "2024-07-15", class: "Fundamentos de Kimono", status: "Ausente" },
    { date: "2024-07-13", class: "Sem Kimono - Avançado", status: "Presente" },
];

export const mockClasses: Class[] = [
  { id: "c1", name: "Fundamentos de Kimono", time: "18:00 - 19:00", instructor: "Prof. Helio", category: "Adults", enrolled: 18, capacity: 20, branchId: "b1" },
  { id: "c2", name: "Jiu-Jitsu Kids (5-8 anos)", time: "17:00 - 17:45", instructor: "Profa. Carla", category: "Kids", enrolled: 10, capacity: 15, branchId: "b1" },
  { id: "c3", name: "Sem Kimono - Avançado", time: "19:00 - 20:00", instructor: "Prof. Rickson", category: "Adults", enrolled: 12, capacity: 20, branchId: "b1" },
  { id: "c4", name: "Treino Livre", time: "20:00 - 21:00", instructor: "Todos", category: "Adults", enrolled: 25, capacity: 30, branchId: "b1" },
  { id: "c5", name: "Jiu-Jitsu Kids (9-12 anos)", time: "16:00 - 16:45", instructor: "Profa. Carla", category: "Kids", enrolled: 14, capacity: 15, branchId: "b1" },
  { id: "c6", name: "Fundamentos (Manhã)", time: "07:00 - 08:00", instructor: "Prof. Fabio Gurgel", category: "Adults", enrolled: 15, capacity: 20, branchId: "b2" },
  { id: "c7", name: "Sem Kimono (Manhã)", time: "08:00 - 09:00", instructor: "Prof. Fabio Gurgel", category: "Adults", enrolled: 10, capacity: 20, branchId: "b2" },
];

export const mockInstructors: Instructor[] = [
  { id: "i1", name: "Prof. Helio Gracie", avatar: "https://placehold.co/128x128.png", belt: "Coral", stripes: 7, bio: "Co-criador do Jiu-Jitsu Brasileiro, com foco em alavancagem e técnica.", affiliation: "Kings BJJ - Centro", email: "helio@kingsbjj.com", phone: "(55) 1111-1111" },
  { id: "i2", name: "Prof. Rickson Gracie", avatar: "https://placehold.co/128x128.png", belt: "Preta", stripes: 6, bio: "Conhecido por seu recorde invicto e domínio dos fundamentos.", affiliation: "Kings BJJ - Centro", email: "rickson@kingsbjj.com", phone: "(55) 2222-2222" },
  { id: "i3", name: "Profa. Carla Ribeiro", avatar: "https://placehold.co/128x128.png", belt: "Preta", stripes: 3, bio: "Especialista em treino infantil e técnicas modernas de jiu-jitsu.", affiliation: "Kings BJJ - Centro", email: "carla@kingsbjj.com", phone: "(55) 3333-3333" },
  { id: "i4", name: "Prof. Fabio Gurgel", avatar: "https://placehold.co/128x128.png", belt: "Preta", stripes: 5, bio: "Múltiplo campeão mundial e um estrategista especialista.", affiliation: "Kings BJJ - Norte", email: "fabio@kingsbjj.com", phone: "(55) 4444-4444" },
  { id: "i5", name: "Prof. Royler Gracie", avatar: "https://placehold.co/128x128.png", belt: "Preta", stripes: 7, bio: "Mestre em levar a luta para o chão e aplicar finalizações precisas.", affiliation: "Kings BJJ - Sul", email: "royler@kingsbjj.com", phone: "(55) 5555-5555" },
];

export const mockBranches: Branch[] = [
  { id: "b1", name: "Kings BJJ - Centro", address: "Rua Principal 123, Cidade, BR", phone: "(55) 1234-5678", hours: "Seg-Sáb, 9h - 21h", responsible: "Prof. Rickson Gracie" },
  { id: "b2", name: "Kings BJJ - Norte", address: "Avenida Norte 456, Cidade, BR", phone: "(55) 8765-4321", hours: "Seg-Sex, 10h - 20h", responsible: "Prof. Fabio Gurgel" },
  { id: "b3", name: "Kings BJJ - Sul", address: "Avenida Sul 789, Cidade, BR", phone: "(55) 9876-5432", hours: "Seg-Sex, 8h - 22h", responsible: "Prof. Royler Gracie" },
];

export const mockAdultStudents: Omit<User, 'role'>[] = [
    { id: "s1", name: "Maria Silva", email: "maria@email.com", avatar: "https://placehold.co/128x128.png", belt: "Azul", stripes: 2, attendance: { total: 80, lastMonth: 10 }, nextGraduationProgress: 60, affiliation: "Kings BJJ - Centro", branchId: "b1", category: "Adult" },
    { id: "s2", name: "João Pereira", email: "joao@email.com", avatar: "https://placehold.co/128x128.png", belt: "Branca", stripes: 4, attendance: { total: 40, lastMonth: 15 }, nextGraduationProgress: 90, affiliation: "Kings BJJ - Centro", branchId: "b1", category: "Adult" },
    { id: "s3", name: "Carlos Souza", email: "carlos@email.com", avatar: "https://placehold.co/128x128.png", belt: "Roxa", stripes: 1, attendance: { total: 150, lastMonth: 8 }, nextGraduationProgress: 30, affiliation: "Kings BJJ - Norte", branchId: "b2", category: "Adult" },
    { id: "s4", name: "Ana Oliveira", email: "ana@email.com", avatar: "https://placehold.co/128x128.png", belt: "Marrom", stripes: 3, attendance: { total: 200, lastMonth: 16 }, nextGraduationProgress: 85, affiliation: "Kings BJJ - Norte", branchId: "b2", category: "Adult" },
    { id: "s5", name: "Bruno Alves", email: "bruno@email.com", avatar: "https://placehold.co/128x128.png", belt: "Preta", stripes: 1, attendance: { total: 300, lastMonth: 18 }, nextGraduationProgress: 10, affiliation: "Kings BJJ - Centro", branchId: "b1", category: "Adult" },
    { id: "s6", name: "André Santos", email: "andre@email.com", avatar: "https://placehold.co/128x128.png", belt: "Azul", stripes: 1, attendance: { total: 60, lastMonth: 9 }, nextGraduationProgress: 45, affiliation: "Kings BJJ - Sul", branchId: "b3", category: "Adult" },
];

export const mockKidsStudents: Omit<User, 'role'>[] = [
    { id: "k1", name: "Miguel Santos", email: "miguel@email.com", avatar: "https://placehold.co/128x128.png", belt: "Cinza", stripes: 2, attendance: { total: 50, lastMonth: 8 }, nextGraduationProgress: 40, affiliation: "Kings BJJ - Centro", branchId: "b1", category: "Kids" },
    { id: "k2", name: "Sofia Lima", email: "sofia@email.com", avatar: "https://placehold.co/128x128.png", belt: "Amarela", stripes: 1, attendance: { total: 65, lastMonth: 12 }, nextGraduationProgress: 70, affiliation: "Kings BJJ - Norte", branchId: "b2", category: "Kids" },
    { id: "k3", name: "Davi Oliveira", email: "davi@email.com", avatar: "https://placehold.co/128x128.png", belt: "Branca", stripes: 3, attendance: { total: 20, lastMonth: 10 }, nextGraduationProgress: 80, affiliation: "Kings BJJ - Centro", branchId: "b1", category: "Kids" },
    { id: "k4", name: "Laura Pereira", email: "laura@email.com", avatar: "https://placehold.co/128x128.png", belt: "Laranja", stripes: 0, attendance: { total: 90, lastMonth: 14 }, nextGraduationProgress: 25, affiliation: "Kings BJJ - Norte", branchId: "b2", category: "Kids" },
];

export const mockAllStudents = [...mockAdultStudents, ...mockKidsStudents];


export const mockTeamGrowth = [
  { month: "Fev", total: 35 },
  { month: "Mar", total: 42 },
  { month: "Abr", total: 48 },
  { month: "Mai", total: 55 },
  { month: "Jun", total: 62 },
  { month: "Jul", total: 70 },
];

export const mockGrowthMetrics = [
  { metric: "Novos Alunos (Mês)", value: 15, key: "new" },
  { metric: "Retenção (Trimestre)", value: 92, key: "retention" },
  { metric: "Crescimento Kids", value: 25, key: "kids" },
  { metric: "Engajamento (Check-in)", value: 88, key: "engagement" },
  { metric: "Graduações (Ano)", value: 40, key: "graduations" },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: "a1",
        title: "Graduação de Final de Ano!",
        content: "Preparem seus kimonos! Nossa cerimônia de graduação de final de ano será no dia 15 de Dezembro. Teremos um super seminário com um convidado especial e um churrasco de confraternização. Não percam!",
        author: "Prof. Rickson Gracie",
        authorAvatar: "https://placehold.co/128x128.png",
        timestamp: "há 2 dias"
    },
    {
        id: "a2",
        title: "Horário Especial de Feriado",
        content: "Atenção, equipe! Na próxima sexta-feira, dia 7, não haverá aulas devido ao feriado. As aulas de sábado ocorrerão normalmente. Bom descanso a todos!",
        author: "Admin Geral",
        authorAvatar: "https://placehold.co/128x128.png",
        timestamp: "há 1 semana"
    },
    {
        id: "a3",
        title: "Campeonato Interno Kings BJJ",
        content: "Vem aí o nosso campeonato interno! Será no dia 28 do próximo mês. Inscrições abertas na recepção. Mostre sua técnica e espírito de equipe. Oss!",
        author: "Prof. Fabio Gurgel",
        authorAvatar: "https://placehold.co/128x128.png",
        timestamp: "há 2 semanas"
    }
];
