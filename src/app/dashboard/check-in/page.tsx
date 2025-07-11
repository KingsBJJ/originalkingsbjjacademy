
"use client";

import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserContext, UserUpdateContext } from '../client-layout';


export default function CheckInPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [checkinMessage, setCheckinMessage] = useState<string | null>(null);
  const [checkinTime, setCheckinTime] = useState<Date | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const jsQRRef = useRef<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const user = useContext(UserContext);
  const updateUser = useContext(UserUpdateContext);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    try {
      if (!jsQRRef.current) {
        jsQRRef.current = (await import('jsqr')).default;
      }
      
      if (streamRef.current) {
        stopCamera();
      }

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
  }, [stopCamera, toast]);

  const handleScanAgain = () => {
    setCheckinMessage(null);
    setCheckinTime(null);
    startScan();
  };
  
  useEffect(() => {
    startScan();
    return () => {
      stopCamera();
    };
  }, [startScan, stopCamera]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (
        isScanning &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current &&
        jsQRRef.current &&
        user
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const jsQR = jsQRRef.current;

        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            stopCamera();
            if (code.data === 'KINGS_BJJ_UNIVERSAL_CHECKIN') {
              if (user && updateUser) {
                setCheckinMessage(`Check-in confirmado em ${user.affiliations[0] || 'sua filial'}!`);
                setCheckinTime(new Date());

                // Instead of calculating the new total, we tell the backend to increment.
                const attendanceIncrement = {
                  total: 1, // Increment total by 1
                  lastMonth: 1, // Increment lastMonth by 1
                };
                updateUser({ attendance: attendanceIncrement });

                toast({
                  title: 'Check-in Realizado!',
                  description: `Presença confirmada. Sua frequência foi atualizada.`,
                });
              } else {
                 toast({
                    variant: 'destructive',
                    title: 'Erro no Check-in',
                    description: 'Não foi possível encontrar dados do usuário.',
                  });
              }
            } else {
              toast({
                variant: 'destructive',
                title: 'QR Code Inválido',
                description: 'Este não é um QR code de check-in válido.',
              });
              setTimeout(() => handleScanAgain(), 2000);
            }
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
  }, [isScanning, stopCamera, toast, user, updateUser]);


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
              {checkinMessage && checkinTime ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-green-500/20 p-4 text-green-400">
                        <Check className="h-12 w-12" />
                    </div>
                  <h2 className="text-2xl font-bold">Check-in Confirmado!</h2>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{checkinMessage}</span>
                     <br />
                    <span className="text-xs">
                        {format(checkinTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
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

            {checkinMessage ? (
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
