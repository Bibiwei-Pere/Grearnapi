import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  console.log(nextUrl);
  const isAuthenticated = !!req.auth;
  const session = await auth();
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return console.log("Api routes");
  if (isAuthRoute) {
    if (isAuthenticated && session?.accessToken)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return console.log("Unauthenticated");
  }
  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL("/auth/login", nextUrl));
  return console.log("Unauthenticated");
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

const publicRoutes = ["/"];
const authRoutes = ["/auth/login"];
const apiAuthPrefix = "/api/auth";
const DEFAULT_LOGIN_REDIRECT = "/dashboard";
