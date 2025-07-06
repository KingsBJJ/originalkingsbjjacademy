
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { UserContext } from '../../client-layout';

export default function InvalidRoutePage() {
  const user = useContext(UserContext);
  const role = user?.role || 'student';

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Página Inválida</CardTitle>
          <CardDescription>
            Esta página não deve ser acessada diretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Para editar uma filial, por favor, vá para a lista de filiais e clique no botão "Editar" da filial desejada.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href={`/dashboard/branches?role=${role}`}>Voltar para a Lista de Filiais</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
