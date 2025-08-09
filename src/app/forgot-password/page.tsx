'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Link de Recuperação Enviado",
        description: `Se um usuário com o email ${email} existir, um link para redefinir a senha foi enviado. Verifique sua caixa de entrada e spam.`,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Erro ao enviar link",
        description: "Tente novamente em instantes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/signup" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">Esqueci minha senha</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Informe seu e-mail para receber um link de redefinição.
      </p>

      <form onSubmit={handleReset} className="space-y-3">
        <input
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md px-3 py-2 bg-black text-white disabled:opacity-60"
        >
          {isLoading ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>
    </div>
  );
}
