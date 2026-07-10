import { withAuth } from "next-auth/middleware";
import type { AdminRole } from "@prisma/client";
import { canAccessAdminResource, resourceFromPath } from "@/lib/admin/permissions";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;

      const role = token.role || "ADMIN";
      const pathname = req.nextUrl.pathname;

      return canAccessAdminResource(role as AdminRole, resourceFromPath(pathname));
    },
  },
});

export const config = {
  matcher: ["/admin((?!/login).*)"],
};
