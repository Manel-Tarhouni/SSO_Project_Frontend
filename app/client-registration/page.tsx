import { redirect } from "next/navigation";
import { RegisterClientRoutes } from "./types";

export default function ClientRegistrationPage() {
  redirect(RegisterClientRoutes.BASIC_INFO);
}
