import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsuarios } from "@/lib/googleSheets";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- TENTATIVA DE LOGIN INICIADA ---");
        
        if (!credentials?.email || !credentials?.password) {
          console.log("ERRO: Email ou senha não fornecidos.");
          return null;
        }

        console.log("1. Email recebido:", credentials.email);

        try {
          console.log("2. Conectando na planilha...");
          const usuarios = await getUsuarios();
          console.log(`3. Planilha lida. ${usuarios.length} usuários encontrados.`);

          // Normaliza os textos para evitar erro de espaço ou maiúscula
          const emailInput = credentials.email.trim().toLowerCase();
          const senhaInput = credentials.password.trim();

          const user = usuarios.find(u => 
            u.email.trim().toLowerCase() === emailInput && 
            u.senha.trim() === senhaInput
          );

          if (user) {
            console.log("4. SUCESSO: Usuário encontrado:", user.nome);
            return {
              id: user.email,
              name: user.nome,
              email: user.email,
            };
          }

          console.log("4. FALHA: Usuário não encontrado ou senha incorreta.");
          return null;

        } catch (error) {
          console.error("ERRO CRÍTICO NO SISTEMA:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redireciona para login se der erro
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Ativa logs do NextAuth
});

export { handler as GET, handler as POST };