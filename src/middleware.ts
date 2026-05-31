import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLoginPage = nextUrl.pathname === '/admin/login';
  const isAdminPath = nextUrl.pathname.startsWith('/admin');
  const isAdminApi = nextUrl.pathname.startsWith('/api/admin');

  if (isAdminApi && !isLoggedIn) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isAdminPath && !isLoginPage && !isLoggedIn) {
    const url = new URL('/admin/login', nextUrl);
    url.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(url);
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/admin', nextUrl));
  }
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
