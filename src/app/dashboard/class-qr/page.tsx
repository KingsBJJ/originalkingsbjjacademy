"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

function QRCodeGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const className = searchParams.get('class');

  if (!className) {
    return (
      <div className="text-center">
        <p className="text-destructive">Nome da aula não fornecido.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-md print:border-none print:shadow-none">
      <CardHeader className="print:text-center">
        <CardTitle className="text-2xl">QR Code para: {className}</CardTitle>
        <CardDescription className="print:hidden">
          Aponte a câmera do seu celular para fazer o check-in na aula ou imprima o código.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        <div className="rounded-lg bg-white p-4">
          <QRCode value={className} size={256} />
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

export default function ClassQRCodePage() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Suspense fallback={<div className="text-muted-foreground">Carregando QR Code...</div>}>
                <QRCodeGenerator />
            </Suspense>
        </div>
    );
}
