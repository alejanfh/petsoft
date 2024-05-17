// will run when client ----> REQUEST ----> server
import NextAuth from "next-auth";
import { nextAuthEdgeConfig } from "./lib/auth-edge";
import { nextAuthNoEdgeConfig } from "./lib/auth-no-edge";

// export function middleware(request: Request) {
//   console.log(request.url)
//   return NextRespones.next()
// }

export default NextAuth(nextAuthNoEdgeConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
