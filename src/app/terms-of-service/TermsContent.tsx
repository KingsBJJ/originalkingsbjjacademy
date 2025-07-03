'use client'; // Marque este componente como cliente

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";

// Componente cliente para o conteúdo que usa useSearchParams
interface TermsContentProps {
  role: string | null;
}
export default function TermsContent({ role }: TermsContentProps) {
  const backHref = role ? `/dashboard?role=${role}` : '/signup';
  const backText = role ? 'Voltar para o Painel' : 'Voltar para o Cadastro';

  return (
    <> {/* Use um Fragment para agrupar elementos */}
      <ScrollArea className="h-96 w-full rounded-md border border-white/20 bg-black/20 p-4 text-sm">
        <div className="space-y-4 text-white/90">
            <p>
                Eu, <span className="font-bold">[NOME DO RESPONSÁVEL]</span>, portador(a) do RG/CPF <span className="font-bold">[NÚMERO DO DOCUMENTO]</span>, na qualidade de responsável legal pelo(a) menor <span className="font-bold">[NOME DO(A) MENOR]</span>, nascido(a) em <span className="font-bold">[DATA DE NASCIMENTO DO(A) MENOR]</span>, autorizo sua participação nas aulas de Jiu-Jitsu Brasileiro oferecidas pela academia Kings BJJ.
            </p>
            <h3 className="font-bold text-lg pt-2">1. Reconhecimento dos Riscos</h3>
            <p>
                Declaro estar ciente de que o Jiu-Jitsu Brasileiro é uma arte marcial e um esporte de contato que envolve riscos inerentes, incluindo, mas não se limitando a, lesões musculares, contusões, fraturas, luxações e outras lesões graves. Compreendo que tais riscos não podem ser totalmente eliminados, mesmo com o cumprimento de todas as normas de segurança.
            </p>
            <h3 className="font-bold text-lg pt-2">2. Condição de Saúde</h3>
            <p>
                Atesto que o(a) menor encontra-se em plenas condições de saúde e apto(a) a participar das atividades físicas propostas. Comprometo-me a informar imediatamente à equipe da Kings BJJ sobre qualquer condição médica preexistente, alergia, ou qualquer outra restrição que possa afetar sua participação segura nas aulas.
            </p>
            <h3 className="font-bold text-lg pt-2">3. Isenção de Responsabilidade</h3>
            <p>
                Por meio deste termo, isento a Kings BJJ, seus proprietários, instrutores, funcionários e representantes de toda e qualquer responsabilidade por acidentes, lesões ou danos que o(a) menor venha a sofrer durante a participação nas aulas ou em eventos relacionados, exceto em casos de negligência comprovada ou má conduta intencional por parte da equipe da academia.
            </p>
            <h3 className="font-bold text-lg pt-2">4. Autorização para Tratamento Médico de Emergência</h3>
            <p>
                Em caso de emergência médica, autorizo a equipe da Kings BJJ a tomar as providências necessárias para o atendimento do(a) menor, incluindo o acionamento de serviços de emergência e o transporte para um hospital, se necessário. Todas as despesas decorrentes de tal atendimento serão de minha responsabilidade.
            </p>
            <h3 className="font-bold text-lg pt-2">5. Direito de Imagem</h3>
            <p>
                Autorizo, por tempo indeterminado e de forma gratuita, o uso da imagem do(a) menor em fotografias, vídeos e outros materiais de divulgação da academia Kings BJJ, que poderão ser veiculados em mídias sociais, websites e materiais promocionais, sem que isso gere qualquer tipo de ônus para a academia.
            </p>
            <p className="pt-4">
                Ao assinar este termo, declaro que li, compreendi e concordo com todas as cláusulas aqui apresentadas, e que estou ciente de meus direitos e obrigações como responsável legal do(a) aluno(a).
            </p>
        </div>
      </ScrollArea>
       <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" asChild>
            <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backText}
            </Link>
        </Button>
      </div>
    </>
  );
}