import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Role-based protection rules
        if (path.startsWith("/dashboard/csirt-admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (path.startsWith("/dashboard/companies") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (path.startsWith("/dashboard/csirt-analyst") && !["admin", "analyst"].includes(token?.role as string)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/csirt/:path*"
    ],
};
