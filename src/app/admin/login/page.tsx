import { Suspense } from "react";
import { AdminLoginClient } from "./AdminLoginClient";

export default function AdminLoginPage() {
  // `useSearchParams()` is used in the client component; wrapping in Suspense
  // avoids Next.js build-time CSR bailout warnings.
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-950 text-neutral-100" />
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}

