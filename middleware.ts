import { withAuth } from "next-auth/middleware";

// Exporta o middleware explicitamente
export default withAuth({
  // Configurações extras (opcional)
  pages: {
    signIn: '/login', // Se não estiver logado, manda pra cá
  },
});

// Configuração de quais rotas proteger
export const config = {
  // Protege a Home, Lançamentos e qualquer coisa dentro de Compras
  matcher: ["/", "/lancamentos/:path*", "/compras/:path*"],
};