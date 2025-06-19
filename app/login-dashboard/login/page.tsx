import { Suspense } from "react";
import LoginPage from "./login-page";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading login…</div>}>
      <LoginPage />
    </Suspense>
  );
}
