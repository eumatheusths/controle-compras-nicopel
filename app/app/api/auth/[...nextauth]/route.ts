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
        console.log("--- TENTATIVA DE LOGIN ---");
        console.log("Email recebido:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Erro: Campos vazios");
          return null;
        }

        try {
          console.log("Buscando usuários na planilha...");
          const usuarios = await getUsuarios();
          console.log(`Sucesso! ${usuarios.length} usuários encontrados.`);

          // Log para ver o que veio da planilha (só para debug, cuidado com senhas reais)
          // console.log("Usuarios na base:", JSON.stringify(usuarios));

          const user = usuarios.find(u => 
            u.email.trim().toLowerCase() === credentials.email.trim().toLowerCase() && 
            u.senha.trim() === credentials.password.trim()
          );

          if (user) {
            console.log("LOGIN APROVADO para:", user.nome);
            return {
              id: user.email,
              name: user.nome,
              email: user.email,
            };
          }

          console.log("FALHA: Usuário não encontrado ou senha incorreta.");
          return null;

        } catch (error) {
          console.error("ERRO CRÍTICO AO ACESSAR PLANILHA:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Se der erro, volta pro login em vez de página de erro feia
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Ativa logs detalhados do NextAuth
});

export { handler as GET, handler as POST };