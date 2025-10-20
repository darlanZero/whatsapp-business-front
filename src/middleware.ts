import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_PAGES } from "./constants/public-routes";
import { JWT_DECODED_DATA } from "./interfaces/jwt-decoded-data";
import { API_TYPE_KEY, TOKEN_KEY } from "./utils/cookies-keys";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(TOKEN_KEY)?.value || null;
  const apiType = request.cookies.get(API_TYPE_KEY)?.value || null;
  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isSessionExpiredPage = pathname === "/session-expired";
  const isApiSelectionPage = pathname === "/api-selection";
  //const isLoginPage = pathname === "/login";

  console.log("Middleware - Pathname:", pathname);
  console.log('Middleware - Token:', token ? 'Presente' : 'Ausente');
  console.log('Middleware - API Type:', apiType || 'Nenhum');


  if (!apiType && !isApiSelectionPage) {
    console.log('Middleware - Sem API Type e não está na página de seleção de API. Redirecionando para /api-selection');
    return redirectTo("/api-selection", request);
  }

  if (apiType && isApiSelectionPage) {
    console.log('Middleware - Com API Type e está na página de seleção de API. Redirecionando para /login');
    return NextResponse.next();
  }

  // Se não tem token
  if (apiType && !token) {
    // Pode acessar rota pública
    if (isPublicPage) {
      console.log('Middleware - Página pública, permitindo acesso');
      return NextResponse.next();
    }

    // Não pode acessar rota privada
    console.log('Middleware - Página privada sem token, redirecionando para /login');
    return redirectTo("/login", request);
  }

  // Com token, vamos verificar se está expirado
  if(token) {
    try{
      const decoded = jwtDecode<JWT_DECODED_DATA>(token);
      const isExpired = Date.now() >= decoded?.exp * 1000;
    
      if (isExpired && !isSessionExpiredPage) {
        console.log('Middleware - Token expirado, redirecionando para /session-expired');
        return redirectTo("/session-expired", request);
      }
    
      if (!isExpired && isSessionExpiredPage) {
        console.log('Middleware - Token não expirado, redirecionando para /dashboard');
        return redirectTo("/dashboard", request);
      }
    
      if (!isExpired && isPublicPage && !isApiSelectionPage) {
        console.log('Middleware - Token não expirado, página pública, redirecionando para /dashboard');
        return redirectTo("/dashboard", request);
      }
    } catch(error){
      console.error("Error decoding token:", error);
      return redirectTo("/login", request);      
    }
  }

  console.log('Middleware - Permitindo acesso à rota:', pathname);
  return NextResponse.next();
}

function redirectTo(path: string, request: NextRequest) {
  console.log(`Middleware - Redirecionando para ${path}`);
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};