"use client";

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toDataURL } from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { UserContext } from '../client-layout';
import { Skeleton } from '@/components/ui/skeleton';

function QRCodeGenerator() {
  const router = useRouter();
  const user = useContext(UserContext);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const universalQRCodeValue = "KINGS_BJJ_UNIVERSAL_CHECKIN";

  useEffect(() => {
    toDataURL(universalQRCodeValue, { width: 256, margin: 1 })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code:', err);
      });
  }, []);

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
          {qrCodeDataUrl ? (
            <Image src={qrCodeDataUrl} alt="QR Code Universal para Check-in" width={256} height={256} />
          ) : (
            <Skeleton className="h-[256px] w-[256px]" />
          )}
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
            <QRCodeGenerator />
        </div>
    );
}
