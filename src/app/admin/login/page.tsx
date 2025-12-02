import {getOrCreateCsrfToken} from "@/lib/CsrfSessionManagement";

type Props = { searchParams?: any };

export default async function AdminLogin({ searchParams }: Props) {
  const csrf = await getOrCreateCsrfToken();
  // `searchParams` can be a synchronous or async-like object in Next.js app router.
  const sp = await searchParams;
  const errorKey = Array.isArray(sp?.error) ? sp.error[0] : sp?.error;
  let errorMessage: string | null = null;
  if (errorKey === 'invalid_credentials') {
    errorMessage = 'The username or password is incorrect.';
  } else if (errorKey === 'csrf') {
    errorMessage = 'Invalid request. Please try again.';
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      {errorMessage && (
        <div role="alert" className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}
      <form action="/api/admin/login" method="POST" className="mt-6 grid gap-3 rounded-2xl border p-4">
        <input type="hidden" name="csrf" value={csrf} />
        <input name="username" placeholder="Username" className="rounded-xl border px-4 py-3 text-sm" />
        <input name="password" type="password" placeholder="Password" className="rounded-xl border px-4 py-3 text-sm" />
        <button className="rounded-xl bg-fuchsia-600 text-white px-4 py-3 text-sm font-semibold">Sign in</button>
        <p className="text-xs text-slate-500">Protected area. Authorized staff only.</p>
      </form>
    </div>
  );
}
