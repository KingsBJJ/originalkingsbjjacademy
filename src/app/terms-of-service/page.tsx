import { Suspense } from 'react';
import TermsContent from './TermsContent'; // Assumindo que TermsContent é onde useSearchParams é usado
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TermsContent />
    </Suspense>
  );
}
