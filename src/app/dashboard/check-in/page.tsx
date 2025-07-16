"use client";

import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Check } from 'lucide-react';
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
  const { toast } = useToast();
  const user = useContext(UserContext);

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
        try {
          jsQRRef.current = (await import('jsqr')).default;
        } catch (err) {
          console.error("Erro ao importar jsQR:", err);
          toast({ variant: "destructive", title: "Erro", description: "Falha ao carregar leitor de QR Code." });
          return;
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setHasCameraPermission(false);
      toast({ variant: "destructive", title: "Permissão negada", description: "Acesso à câmera foi bloqueado. Verifique as configurações do navegador." });
    }
  }, [toast]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Leitura de QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <video ref={videoRef} className="w-full max-w-md mx-auto rounded-md" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex justify-center">
            <Button onClick={startScan} disabled={isScanning}>
              {isScanning ? "Escaneando..." : "Iniciar Leitura"}
            </Button>
            {isScanning && (
              <Button variant="secondary" onClick={stopCamera} className="ml-2">
                Parar
              </Button>
            )}
          </div>
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Permissão de câmera negada</AlertTitle>
              <AlertDescription>
                Por favor, habilite o acesso à câmera no seu navegador para usar o check-in via QR Code.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}