import Image from 'next/image';
import { cn } from '@/lib/utils';

export function KingsBjjLogo({ className }: { className?: string }) {
  return (
    <Image
      src="https://i.imgur.com/rtMtpYw.png"
      alt="Kings BJJ Logo"
      width={512}
      height={512}
      className={cn("object-contain", className)}
      priority
    />
  );
}
