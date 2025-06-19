/*import PasswordSetting from "./password-setting";

export default function Page() {
  return <PasswordSetting />;
}
*/

import { Suspense } from "react";
import PasswordSettingPage from "./password-setting"; // or whatever you named the actual client component

export const dynamic = "force-dynamic"; // ensures SSR on every request (needed when using useSearchParams)

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading password setting…</div>}>
      <PasswordSettingPage />
    </Suspense>
  );
}
