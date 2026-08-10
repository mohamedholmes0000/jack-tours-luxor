import type { AdminRole } from "@prisma/client";

export type AdminResource =
  | "dashboard"
  | "tours"
  | "destinations"
  | "gallery"
  | "blog"
  | "faqs"
  | "inquiries"
  | "settings"
  | "testimonials"
  | "pages"
  | "users"
  | "profile";

export const roleLabels: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

export const roleDescriptions: Record<AdminRole, string> = {
  SUPER_ADMIN: "Full access including user management",
  ADMIN: "Full content access, no user management",
  EDITOR: "Can edit content, no settings",
  VIEWER: "Read-only access",
};

export const roleBadgeClassNames: Record<AdminRole, string> = {
  SUPER_ADMIN: "border-purple-200 bg-purple-50 text-purple-800",
  ADMIN: "border-blue-200 bg-blue-50 text-blue-800",
  EDITOR: "border-emerald-200 bg-emerald-50 text-emerald-800",
  VIEWER: "border-gray-200 bg-gray-50 text-gray-700",
};

export function canAccessAdminResource(role: AdminRole, resource: AdminResource) {
  if (role === "SUPER_ADMIN") return true;
  if (resource === "users") return false;
  if (resource === "profile" || resource === "dashboard") return true;
  if (role === "ADMIN") return true;
  if (role === "EDITOR") return ["tours", "destinations", "gallery", "pages"].includes(resource);
  if (role === "VIEWER") return true;
  return false;
}

export function canWriteAdminResource(role: AdminRole, resource: AdminResource, method: "create" | "update" | "delete" = "update") {
  if (role === "SUPER_ADMIN") return true;
  if (role === "VIEWER") return false;
  if (resource === "users") return false;
  if (role === "ADMIN") return true;
  if (role === "EDITOR") {
    if (method === "delete") return false;
    return ["tours", "destinations", "gallery", "pages", "profile"].includes(resource);
  }
  return false;
}

export function resourceFromPath(pathname: string): AdminResource {
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/tours")) return "tours";
  if (pathname.startsWith("/admin/activities")) return "tours";
  if (pathname.startsWith("/admin/hotels")) return "tours";
  if (pathname.startsWith("/admin/destinations")) return "destinations";
  if (pathname.startsWith("/admin/gallery")) return "gallery";
  if (pathname.startsWith("/admin/blog")) return "blog";
  if (pathname.startsWith("/admin/reviews")) return "testimonials";
  if (pathname.startsWith("/admin/faqs")) return "faqs";
  if (pathname.startsWith("/admin/inquiries")) return "inquiries";
  if (pathname.startsWith("/admin/settings")) return "settings";
  if (pathname.startsWith("/admin/pages")) return "pages";
  if (pathname.startsWith("/admin/profile")) return "profile";
  return "dashboard";
}
