export default function BecomeALenderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Convertite en prestador</h1>
        <p className="mt-4 text-slate-600">Únete a nuestra comunidad de lenders y gana alquilando tus prendas cuando no las uses.</p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Beneficios</h2>
          <ul className="mt-3 ml-5 list-disc text-slate-600 dark:text-slate-300">
            <li>Ingresos extra por prendas que no estás usando.</li>
            <li>Limpieza profesional incluida entre alquileres.</li>
            <li>Seguro parcial para daños y gestión de devoluciones.</li>
            <li>Dashboard para controlar reservas y pagos.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Cómo funciona</h2>
          <ol className="mt-3 ml-5 list-decimal text-slate-600 dark:text-slate-300">
            <li>Completás el formulario de inscripción.</li>
            <li>Revisamos tus prendas y confirmamos la elegibilidad.</li>
            <li>Publicás los artículos en el catálogo y recibís reservas.</li>
            <li>Recibís el pago una vez completado el alquiler, descontando la comisión.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Formulario de inscripción</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Completá los datos y nuestro equipo se contactará para los siguientes pasos.</p>

          <form action="/api/become-a-lender" method="POST" className="mt-4 grid grid-cols-1 gap-3">
            <label className="sr-only" htmlFor="name">Nombre completo</label>
            <input id="name" name="name" required placeholder="Nombre completo" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500" />

            <label className="sr-only" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="tu@ejemplo.com" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500" />

            <label className="sr-only" htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" placeholder="Teléfono" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500" />

            <label className="sr-only" htmlFor="city">Localidad</label>
            <input id="city" name="city" placeholder="Ciudad" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500" />

            <label className="sr-only" htmlFor="notes">Notas</label>
            <textarea id="notes" name="notes" placeholder="Cuéntanos sobre tus prendas (tipos, talles, estado)" className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500" rows={4}></textarea>

            <div className="flex items-center gap-3 mt-2">
              <button type="submit" className="inline-flex items-center rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-500">Enviar inscripción</button>
              <p className="text-sm text-slate-500">Te responderemos en 3-5 días hábiles.</p>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Preguntas frecuentes para lenders</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Si necesitás más información podés escribir a <a href="mailto:sebastian.galli@correo.ucu.edu.uy" className="text-fuchsia-600">lenders@glamrent.example</a> o visitar la sección de Preguntas Frecuentes.</p>
        </div>
      </section>
    </div>
  );
}
