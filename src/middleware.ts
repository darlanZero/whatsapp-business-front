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

  if (!apiType && !isApiSelectionPage) {
    return redirectTo("/api-selection", request);
  }

  // Se não tem token
  if (apiType && !token) {
    // Pode acessar rota pública
    if (isPublicPage) return NextResponse.next();

    // Não pode acessar rota privada
    return redirectTo("/login", request);
  }

  // Com token, vamos verificar se está expirado
  if(token) {
    try{
      const decoded = jwtDecode<JWT_DECODED_DATA>(token);
      const isExpired = Date.now() >= decoded?.exp * 1000;
    
      if (isExpired && !isSessionExpiredPage) {
        return redirectTo("/session-expired", request);
      }
    
      if (!isExpired && isSessionExpiredPage) {
        return redirectTo("/dashboard", request);
      }
    
      if (!isExpired && isPublicPage && !isApiSelectionPage) {
        return redirectTo("/dashboard", request);
      }
    } catch(error){
      console.error("Error decoding token:", error);
      return redirectTo("/login", request);      
    }
  }

  return NextResponse.next();
}

function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};