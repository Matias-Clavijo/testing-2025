export default function FAQPage() {
  const faqs = [
    {
      q: '¿Por cuántos días puedo alquilar un artículo?',
      a: 'El período mínimo es de 1 día y el máximo de 7 días consecutivos.'
    },
    {
      q: '¿Puedo extender un alquiler ya confirmado?',
      a: 'Sí, siempre que el artículo esté disponible en las nuevas fechas. Deberás solicitar la extensión con al menos 48 horas de anticipación.'
    },
    {
      q: '¿Qué tallas están disponibles?',
      a: 'Depende del tipo de artículo. Por ejemplo, los vestidos y chaquetas están disponibles en tallas XS, S, M, L y XL, los zapatos del 35 al 45, y los bolsos son talles únicos (U).'
    },
    {
      q: '¿Cuándo se realiza el cobro?',
      a: 'El pago se realiza al momento de retirar el vestido.'
    },
    {
      q: '¿Qué métodos de pago aceptan?',
      a: 'Aceptamos tarjetas de crédito y débito, transferencias bancarias y pagos a través de Mercado Pago.'
    },
    {
      q: '¿Puedo probarme el vestido antes de alquilarlo?',
      a: 'Sí, contamos con probadores en el local, podes venir antes de alquilarlo para asegurar que se encuentra tu talla para alquilar.'
    },
    {
      q: '¿Realizan ajustes de talle?',
      a: 'No, creemos que la variedad de prendas y de tallas que se encuentran disponibles se adaptan a cada tipo de cuerpo.'
    },
    {
      q: '¿Puedo cancelar mi reserva?',
      a: 'Sí, si se cancela con al menos 72 horas de anticipación para que esté disponible para otros usuarios.'
    },
    {
      q: '¿Qué pasa si devuelvo el vestido más tarde de lo acordado?',
      a: 'Se cobrará un recargo por día de demora equivalente al 20% del valor del alquiler original.'
    },
    {
      q: '¿Qué ocurre si el vestido se daña durante el uso?',
      a: 'Pequeños arreglos o limpiezas están cubiertos, pero si el daño es irreparable, deberás abonar el costo de reposición.'
    },
    {
      q: '¿Debo lavar el vestido antes de devolverlo?',
      a: 'No, nosotros nos encargamos de la limpieza profesional después de cada alquiler.'
    },
    {
      q: '¿Qué pasa si el vestido se ensucia durante el evento?',
      a: 'No te preocupes, incluimos limpieza básica en el servicio. Solo se aplicarán cargos adicionales en caso de manchas permanentes o daños graves.'
    },
    {
      q: '¿Dónde puedo retirar el vestido?',
      a: 'Podés retirarlo en nuestro local o solicitar envío a domicilio (con costo adicional).'
    },
    {
      q: '¿Realizan envíos a otras ciudades?',
      a: 'Sí, enviamos a todo el país mediante servicios de mensajería. Los costos y tiempos dependen del destino.'
    },
    {
      q: '¿Cuándo debo devolver el vestido si lo recibí por envío?',
      a: 'Debe ser despachado el mismo día acordado en el contrato de alquiler para evitar recargos.'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Preguntas Frecuentes</h1>
        <p className="mt-4 text-slate-600">Aquí encontrarás respuestas rápidas sobre alquileres, talles, envíos y políticas generales.</p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-6">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 dark:text-slate-100">{f.q}</summary>
            <div className="mt-3 text-slate-600 dark:text-slate-300">{f.a}</div>
          </details>
        ))}
      </section>
    </div>
  );
}
