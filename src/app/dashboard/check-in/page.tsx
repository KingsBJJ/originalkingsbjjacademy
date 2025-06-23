"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Check, QrCode, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckInPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startScan = async () => {
    try {
      if (streamRef.current) stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsScanning(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Acesso à Câmera Negado',
        description: 'Por favor, habilite a permissão de câmera para continuar.',
      });
    }
  };

  const handleScanAgain = () => {
    setScannedCode(null);
    startScan();
  };
  
  useEffect(() => {
    startScan();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (
        isScanning &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            setScannedCode(code.data);
            setIsScanning(false);
            stopCamera();
            toast({
              title: 'Check-in Realizado!',
              description: `Código "${code.data}" escaneado com sucesso.`,
            });
          }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, stopCamera, toast]);


  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Check-in por QR Code</h1>
          <p className="text-muted-foreground">
            Aponte a câmera para o QR code da aula para registrar sua presença.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            
            <div className="relative flex h-80 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {scannedCode ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-green-500/20 p-4 text-green-400">
                        <Check className="h-12 w-12" />
                    </div>
                  <h2 className="text-2xl font-bold">Check-in Confirmado!</h2>
                  <p className="text-muted-foreground">
                    Você está confirmado na aula: <br />
                    <span className="font-semibold text-foreground">{scannedCode}</span>
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    autoPlay
                    muted
                  />
                  <div className="absolute inset-0 z-10 border-[20px] border-black/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                </>
              )}
            </div>

            {hasCameraPermission === false && (
                <Alert variant="destructive" className="max-w-md">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>Câmera Inacessível</AlertTitle>
                    <AlertDescription>
                        Não foi possível acessar a câmera. Verifique as permissões no seu navegador e tente novamente.
                    </AlertDescription>
                </Alert>
            )}

            {scannedCode ? (
                 <div className="flex gap-2">
                    <Button onClick={() => router.back()}>Voltar ao Painel</Button>
                    <Button variant="outline" onClick={handleScanAgain}>Escanear Outro</Button>
                 </div>
            ) : (
                <p className="text-center text-sm text-muted-foreground">
                    {isScanning ? "Procurando QR code..." : "Posicionando câmera..."}
                </p>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
