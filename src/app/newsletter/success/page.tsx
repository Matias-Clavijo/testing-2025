import Link from "next/link";

export default function NewsletterSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">¡Ya te subscribimos!</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Gracias por unirte a nuestro newsletter. Pronto recibirás novedades, tips y ofertas.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-fuchsia-600 px-6 py-3 text-sm font-semibold text-white hover:bg-fuchsia-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}


