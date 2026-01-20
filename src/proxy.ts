import { NextResponse, NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    // We check for the cookie instead of localStorage since middleware runs on the edge
    // For now, this is a placeholder. In a real scenario, we'd use NextAuth or a secure cookie.
    const authCookie = request.cookies.get('admin_session');
    const isLoginPage = request.nextUrl.pathname === '/login';

    // If not authenticated and not on login page, redirect to login
    // if (!authCookie && !isLoginPage) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    // If authenticated and on login page, redirect to dashboard
    // if (authCookie && isLoginPage) {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
