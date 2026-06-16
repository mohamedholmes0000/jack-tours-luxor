import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;

      const role = token.role || "ADMIN";
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/admin/users")) return role === "SUPER_ADMIN";
      if (pathname.startsWith("/admin/profile")) return true;
      if (role === "SUPER_ADMIN" || role === "ADMIN") return true;
      if (role === "VIEWER") {
        return [
          "/admin",
          "/admin/tours",
          "/admin/destinations",
          "/admin/gallery",
          "/admin/blog",
          "/admin/faqs",
          "/admin/inquiries",
          "/admin/settings",
        ].includes(pathname);
      }
      if (role === "EDITOR") {
        return (
          pathname === "/admin" ||
          pathname.startsWith("/admin/tours") ||
          pathname.startsWith("/admin/destinations") ||
          pathname.startsWith("/admin/gallery")
        );
      }

      return false;
    },
  },
});

export const config = {
  matcher: ["/admin((?!/login).*)"],
};
