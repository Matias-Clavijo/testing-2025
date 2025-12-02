"use client";
import { useMemo, useState } from 'react';

type Rental = {
  id: string;
  item: string;
  renter: string;
  email: string;
  phone?: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  status: 'confirmed' | 'cancelled' | 'completed';
};

function parseDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}

function daysBetween(a: Date, b: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay) + 1;
}

type Props = { csrf: string };

export default function RentManagementClient({ csrf }: Props) {
  // mock data; replace with fetch to your API as needed
  const [rentals, setRentals] = useState<Rental[]>([
    { id: 'r1', item: 'Silk Evening Gown', renter: 'Ana Pérez', email: 'ana@example.com', phone: '555-0101', start: '2025-12-05', end: '2025-12-07', status: 'confirmed' },
    { id: 'r2', item: 'Black Tie Dress', renter: 'María López', email: 'maria@example.com', phone: '555-0202', start: '2025-12-10', end: '2025-12-12', status: 'confirmed' },
  ]);

  const [selected, setSelected] = useState<Rental | null>(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthInfo = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days = last.getDate();
    return { first, last, days };
  }, [year, month]);

  const visibleRentals = rentals.filter(r => r.status !== 'cancelled');

  const rentalsInMonth = visibleRentals.filter(r => {
    const s = parseDate(r.start);
    const e = parseDate(r.end);
    return !(e < monthInfo.first || s > monthInfo.last);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 rounded-2xl border p-4 bg-white dark:bg-slate-900">
        <h3 className="font-semibold">Rentals</h3>
        <div className="mt-4">
          {visibleRentals.length === 0 ? (
            <div className="text-sm text-slate-500">No rentals found</div>
          ) : (
            <ul className="space-y-3">
              {visibleRentals.map(r => (
                <li key={r.id} className="p-3 rounded-md border hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.item}</div>
                      <div className="text-sm text-slate-500">{r.renter}</div>
                    </div>
                    <div className="text-sm text-slate-500">{r.start} → {r.end}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="text-sm text-fuchsia-600" onClick={() => setSelected(r)}>View</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 rounded-2xl border bg-white dark:bg-slate-900 p-4">
        <h3 className="font-semibold">Calendar — {today.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h3>

        <div className="mt-4 grid grid-cols-7 gap-1 text-sm">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center font-medium text-slate-500">{d}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: monthInfo.first.getDay() }).map((_, i) => (
            <div key={'pad-' + i} />
          ))}
          {Array.from({ length: monthInfo.days }).map((_, i) => {
            const day = i + 1;
            const iso = new Date(year, month, day).toISOString().slice(0,10);
            const dayRentals = rentalsInMonth.filter(r => parseDate(r.start).toISOString().slice(0,10) === iso || (parseDate(r.start) < new Date(year, month, day) && parseDate(r.end) >= new Date(year, month, day)));
            return (
              <div key={iso} className="min-h-[72px] p-1 border rounded-md">
                <div className="text-xs text-slate-500">{day}</div>
                <div className="mt-1 space-y-1">
                  {dayRentals.map(r => (
                    <button key={r.id} onClick={() => setSelected(r)} className="block w-full text-left rounded-md bg-fuchsia-50 text-xs text-fuchsia-700 px-2 py-1">{r.item} — {r.renter}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6">
            <h4 className="text-lg font-semibold">Rental details</h4>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <div><strong>Item:</strong> {selected.item}</div>
              <div><strong>Renter:</strong> {selected.renter}</div>
              <div><strong>Dates:</strong> {selected.start} → {selected.end}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone ?? '—'}</div>
              <div><strong>Status:</strong> {selected.status}</div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {selected.status === 'confirmed' && (
                <button
                  onClick={async () => {
                    const ok = window.confirm('Are you sure you want to cancel this rental?');
                    if (!ok) return;
                    try {
                      const form = new FormData();
                      form.set('csrf', csrf);
                      await fetch(`/api/admin/rentals/${selected.id}/cancel`, {
                        method: 'POST',
                        body: form,
                      });
                    } catch (e) {
                      // no-op fallback to local state update
                    } finally {
                      setRentals(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'cancelled' } : r));
                      setSelected(null);
                    }
                  }}
                  className="rounded-xl border px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-800"
                >
                  Cancel rental
                </button>
              )}
              <button onClick={() => setSelected(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
