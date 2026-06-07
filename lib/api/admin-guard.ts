import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function isAdminRequest() {
  return Boolean(await getServerSession(authOptions));
}
