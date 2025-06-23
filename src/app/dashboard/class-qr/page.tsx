"use client";

import { Suspense, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { UserContext } from '../client-layout';

function QRCodeGenerator() {
  const router = useRouter();
  const user = useContext(UserContext);

  if (!user) {
    return (
        <div className="text-center text-muted-foreground">
            Carregando dados do usuário...
        </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Esta área é restrita a administradores.</p>
          <Button asChild className="mt-4">
            <Link href={`/dashboard?role=${user.role}`}>Voltar ao Painel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const universalQRCodeValue = "KINGS_BJJ_UNIVERSAL_CHECKIN";

  return (
    <Card className="w-full max-w-md print:border-none print:shadow-none">
      <CardHeader className="print:text-center">
        <CardTitle className="text-2xl">QR Code Universal para Check-in</CardTitle>
        <CardDescription className="print:hidden">
          Este QR code é válido para todas as aulas e filiais. Imprima e deixe-o visível para os alunos.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <div className="rounded-lg bg-white p-4">
          <QRCode value={universalQRCodeValue} size={256} />
        </div>
        <div className="flex w-full gap-2 print:hidden">
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={handlePrint} className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UniversalQRCodePage() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Suspense fallback={<div className="text-muted-foreground">Carregando QR Code...</div>}>
                <QRCodeGenerator />
            </Suspense>
        </div>
    );
}
