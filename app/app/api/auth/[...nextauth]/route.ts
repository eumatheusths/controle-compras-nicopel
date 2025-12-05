import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsuarios } from "@/lib/googleSheets"; // Importa a função que lê sua planilha

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validação básica: se não digitou nada, bloqueia.
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 2. Busca a lista atualizada de usuários da planilha
          const usuarios = await getUsuarios();

          // 3. Procura o usuário (ignorando maiúsculas/minúsculas no email)
          const user = usuarios.find(u => 
            u.email.toLowerCase() === credentials.email.toLowerCase() && 
            u.senha === credentials.password
          );

          // 4. Se achou, libera o acesso
          if (user) {
            return {
              id: user.email,
              name: user.nome,
              email: user.email,
              // Você pode passar a função também se quiser controlar permissões depois
              // role: user.funcao 
            };
          }

          // Se não achou ou senha errada
          return null;

        } catch (error) {
          console.error("Erro ao tentar logar:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Redireciona para sua tela personalizada se der erro ou pedir login
  },
  session: {
    strategy: "jwt", // Usa cookies seguros (padrão)
  },
  secret: process.env.NEXTAUTH_SECRET, // Lê a chave do .env.local
});

export { handler as GET, handler as POST };