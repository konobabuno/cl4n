import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/config/i18n/i18nConfig";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  const nextLocaleCookie = request.cookies ? request.cookies.get('NEXT_LOCALE') : null;

  if (nextLocaleCookie) {
    const langCookie = nextLocaleCookie.value;
    return langCookie;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  const locale = matchLocale(languages, locales, defaultLocale);

  return locale;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/intent/edit/mode=presentation')) {
    const presentationPath = pathname.replace('/intent/edit/mode=presentation', '')
    const newPathname = `/studio/intent/edit/mode=presentation;${presentationPath}`

    const newUrl = request.nextUrl.clone()
    newUrl.searchParams.delete('perspective')
    
    newUrl.pathname = newPathname

    return NextResponse.redirect(newUrl)
  }
  

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  } else {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathname.split('/')[1]);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api/|api$|_next/|favicon.ico|studio|assets/|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.ico$).*)"
  ]
};