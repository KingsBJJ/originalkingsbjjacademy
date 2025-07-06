import type { User } from './firestoreService';

export const beltColors = {
  Branca: { bg: "bg-white", text: "text-black" },
  Azul: { bg: "bg-blue-600", text: "text-white" },
  Roxa: { bg: "bg-purple-600", text: "text-white" },
  Marrom: { bg: "bg-yellow-800", text: "text-white" },
  Preta: { bg: "bg-black", text: "text-white" },
  Coral: { bg: "bg-gradient-to-r from-red-600 to-black", text: "text-white" },
};

export const allBelts: (keyof typeof beltColors)[] = ["Branca", "Azul", "Roxa", "Marrom", "Preta", "Coral"];

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
  id: "student_user_1",
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
  mainInstructor: "Prof. Rickson Gracie",
};

const professorUser: User = {
  id: "professor_user_1",
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
  id: "admin_user_1",
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
};


export const mockAnnouncements = [
    {
        id: '1',
        title: 'Seminário Especial com Mestre Leão',
        content: 'Neste sábado, teremos um seminário imperdível com o grande Mestre Leão, faixa coral 8º grau. Foco em defesa pessoal e Jiu-Jitsu da velha guarda. Vagas limitadas, inscrições na recepção.',
        author: 'Prof. Rickson Gracie',
        authorAvatar: 'https://placehold.co/128x128.png',
        timestamp: '2 dias atrás'
    },
    {
        id: '2',
        title: 'Aulão de Feriado Confirmado!',
        content: 'Pessoal, nosso tradicional aulão de feriado está confirmado! Será às 10h da manhã. Todos os níveis e todas as filiais estão convidados para um super treino de confraternização.',
        author: 'Admin Geral',
        authorAvatar: 'https://placehold.co/128x128.png',
        timestamp: '5 dias atrás'
    }
];

export const mockAttendanceHistory = [
    { date: '03/07/2024', class: 'Fundamentos', status: 'Presente' },
    { date: '01/07/2024', class: 'Avançado', status: 'Presente' },
    { date: '28/06/2024', class: 'No-Gi', status: 'Presente' },
    { date: '26/06/2024', class: 'Fundamentos', status: 'Faltou' },
];

export const mockInstructors = [
  {
    id: 'inst1',
    name: 'Prof. Hélio Gracie',
    email: 'helio@kingsbjj.com',
    phone: '(21) 99999-1111',
    affiliations: ['Kings BJJ - Centro'],
    belt: 'Coral' as keyof typeof beltColors,
    stripes: 9,
    avatar: 'https://placehold.co/128x128.png'
  },
  {
    id: 'inst2',
    name: 'Prof. Carlson Gracie',
    email: 'carlson@kingsbjj.com',
    phone: '(21) 99999-2222',
    affiliations: ['Kings BJJ - Zona Sul'],
    belt: 'Preta' as keyof typeof beltColors,
    stripes: 6,
    avatar: 'https://placehold.co/128x128.png'
  },
];
