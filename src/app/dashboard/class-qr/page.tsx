
"use client";

import { useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toDataURL } from 'qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { UserContext } from '../client-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';

function QRCodeGenerator() {
  const router = useRouter();
  const user = useContext(UserContext);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const qrCardRef = useRef<HTMLDivElement>(null);

  const universalQRCodeValue = "KINGS_BJJ_UNIVERSAL_CHECKIN";

  useEffect(() => {
    toDataURL(universalQRCodeValue, { width: 512, margin: 2, errorCorrectionLevel: 'H' })
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

  const handleDownloadPdf = async () => {
    if (!qrCardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(qrCardRef.current, {
            useCORS: true,
            backgroundColor: '#1a1a1a', // Same as card background
            scale: 2 // Higher scale for better quality
        });
        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions in mm: 210 x 297
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;

        let newImgWidth = pdfWidth - 20; // with 10mm margin on each side
        let newImgHeight = newImgWidth / ratio;

        if (newImgHeight > pdfHeight - 20) {
            newImgHeight = pdfHeight - 20;
            newImgWidth = newImgHeight * ratio;
        }
        
        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
        pdf.save('kings-bjj-qrcode.pdf');
    } catch (error) {
        console.error("Error generating PDF", error);
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <Card className="w-full max-w-lg">
      <div ref={qrCardRef} className="bg-card p-6">
        <CardHeader className="text-center">
            <KingsBjjLogo className="mx-auto h-20 w-20" />
            <CardTitle className="text-3xl font-bold">Check-in da Aula</CardTitle>
            <CardDescription>
            Este QR code é válido para todas as aulas e filiais.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="rounded-lg bg-white p-4">
            {qrCodeDataUrl ? (
                <Image src={qrCodeDataUrl} alt="QR Code Universal para Check-in" width={400} height={400} priority />
            ) : (
                <Skeleton className="h-[400px] w-[400px]" />
            )}
            </div>
            <p className="text-lg font-semibold">Aponte a câmera do seu celular</p>
        </CardContent>
      </div>
      <CardContent className="pt-0">
        <div className="flex w-full gap-2 pt-4">
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={handleDownloadPdf} className="w-full" disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Baixando...' : 'Baixar PDF'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UniversalQRCodePage() {
    return (
        <div className="flex h-full w-full items-center justify-center p-4">
            <QRCodeGenerator />
        </div>
    );
}
