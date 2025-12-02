import Link from "next/link";
import Image from "next/image";
import {listItems, type Category} from "../../../lib/RentalManagementSystem";

type SearchParams = {
  q?: string;
  category?: Category | "";
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category = "", size = "", color = "", style = "", start = "", end = "" } = await searchParams;

  const itemsFromList = listItems({
    q,
    category: category || undefined,
    size: size || undefined,
    color: color || undefined,
    style: style || undefined,
  });

  function parseDateSafe(s?: string | null) {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = parseDateSafe(start);
  const endDate = parseDateSafe(end);
  const hasPastDate =
    (startDate !== null && startDate < today) || (endDate !== null && endDate < today);

  const items = hasPastDate ? [] : itemsFromList;
  const showPastAlert = hasPastDate;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">Browse catalog</h1>
      <form method="GET" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <input name="q" defaultValue={q} placeholder="Search…" className="rounded-xl border px-3 py-2 text-sm" />
        <select name="category" defaultValue={category} className="rounded-xl border px-3 py-2 text-sm">
          <option value="">All categories</option>
          <option value="dress">Dresses</option>
          <option value="shoes">Shoes</option>
          <option value="bag">Bags</option>
          <option value="jacket">Jackets</option>
        </select>
        <input name="size" defaultValue={size} placeholder="Size" className="rounded-xl border px-3 py-2 text-sm" />
        <input name="color" defaultValue={color} placeholder="Color" className="rounded-xl border px-3 py-2 text-sm" />
        <input name="style" defaultValue={style} placeholder="Style (e.g., cocktail)" className="rounded-xl border px-3 py-2 text-sm" />
        <input name="start" type="date" defaultValue={start} className="rounded-xl border px-3 py-2 text-sm" />
        <input name="end" type="date" defaultValue={end} className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-xl bg-fuchsia-600 text-white px-4 py-2 text-sm">Search</button>
      </form>

      {showPastAlert && (
        <div role="alert" aria-live="assertive" className="swal2-popup swal-modal fixed z-50 inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-xl max-w-md text-center">
            <h2 className="text-lg font-semibold">Invalid date range</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              The selected date range is in the past and is not valid.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden">
            <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800">
              <Image src={it.images[0]} alt={it.alt} fill className="object-cover" />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="rounded-full bg-white/85 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-100">
                  From ${it.pricePerDay}/day
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{it.category}</p>
              <p className="font-medium">{it.name}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Sizes: {it.sizes.join(", ")}</p>
              <div className="mt-3">
                <Link href={`/items/${it.id}`} className="text-sm rounded-lg border px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400">No items match your filters.</p>
        )}
      </div>
    </div>
  );
}
