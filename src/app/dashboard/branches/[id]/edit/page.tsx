export default async function EditBranchPage({ params, searchParams }: any) {
  const role = searchParams?.role as User['role'] || 'student';
  const user = mockUsers[role] || mockUsers.student;
  const branchId = params.id;

  const [branch, instructors] = await Promise.all([
    getBranch(branchId),
    getInstructors(),
  ]);

  if (!branch) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardContent className="pt-6 text-center">
          <KingsBjjLogo className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Filial não encontrada</h2>
          <p className="text-muted-foreground">A filial que você está tentando editar não existe ou foi removida.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <EditBranchForm
      user={user}
      initialBranch={branch}
      instructors={instructors}
    />
  );
}
