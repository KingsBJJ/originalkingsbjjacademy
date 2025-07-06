import { Suspense } from 'react';
import TermsContent from './TermsContent';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';

// The Page component is a Server Component and can receive searchParams
export default function TermsOfServicePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = typeof searchParams.role === 'string' ? searchParams.role : null;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="/background.jpg.png"
        alt="Dojo background"
        data-ai-hint="dojo background"
        fill
        className="object-cover object-center -z-20"
        quality={80}
        priority
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <Card className="mx-auto w-full max-w-3xl border-0 bg-transparent shadow-none sm:border sm:border-white/10 sm:bg-black/20 sm:backdrop-blur-sm sm:shadow-lg">
        <CardHeader className="text-center">
           <KingsBjjLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Termo de Responsabilidade
          </CardTitle>
          <CardDescription className="text-white/80">
            Leia atentamente as cláusulas abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <TermsContent role={role} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
