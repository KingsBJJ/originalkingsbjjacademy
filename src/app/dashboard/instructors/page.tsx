// src/app/dashboard/instructors/[id]/edit/page.ts

// Definição dos tipos
type UserRole = 'admin' | 'instructor' | 'student';
type User = { name: string; role: UserRole };

// Mock de usuários ajustado para usar IDs como chaves
const mockUsers: Record<string, User> = {
  '1': { name: 'Admin User', role: 'admin' },
  '2': { name: 'Instructor User', role: 'instructor' },
  '3': { name: 'Student User', role: 'student' },
};

// Tipo das props da página dinâmica
type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Definição da página assíncrona
export default async function EditInstructorPage({ params, searchParams }: PageProps) {
  // Acessa o ID da rota dinâmica
  const { id } = params;

  // Acesso seguro ao parâmetro 'role' (opcional, caso seja usado)
  const roleParam = searchParams?.role;
  const role = Array.isArray(roleParam) ? roleParam[0] : roleParam;

  // Carregamento do usuário com base no ID
  const user = mockUsers[id] || null;

  // Retorno do JSX
  return (
    <div>
      {user ? (
        <p>Editando {user.name} ({user.role}) com ID: {id}</p>
      ) : (
        <p>Usuário não encontrado para ID: {id}</p>
      )}
    </div>
  );
}