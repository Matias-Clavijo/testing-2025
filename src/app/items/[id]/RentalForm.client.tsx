"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  itemId: number;
  csrf: string;
};

function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function RentalForm({ itemId, csrf }: Props) {
  const [todayISO, setTodayISO] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

  useEffect(() => {
    setTodayISO(toLocalISODate(new Date()));
  }, []);

  const endMin = useMemo(() => (startDate || todayISO || undefined), [startDate, todayISO]);

  return (
    <form action="/api/rentals" method="POST" className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border p-4">
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="csrf" value={csrf} />
      <div className="sm:col-span-2">
        <label className="sr-only" htmlFor="name">Full name</label>
        <input id="name" name="name" required placeholder="Full name" className="w-full rounded-xl border px-4 py-3 text-sm" />
      </div>
      <div>
        <label className="sr-only" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="Email" className="w-full rounded-xl border px-4 py-3 text-sm" />
      </div>
      <div>
        <label className="sr-only" htmlFor="phone">Phone</label>
        <input id="phone" name="phone" required placeholder="Phone" className="w-full rounded-xl border px-4 py-3 text-sm" />
      </div>
      <div>
        <label className="sr-only" htmlFor="start">Start date</label>
        <input
          id="start"
          name="start"
          type="date"
          required
          min={todayISO || undefined}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="end">End date</label>
        <input
          id="end"
          name="end"
          type="date"
          required
          min={endMin}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <button className="w-full sm:w-auto rounded-xl bg-fuchsia-600 text-white px-6 py-3 text-sm font-semibold hover:bg-fuchsia-500">
          Request rental
        </button>
      </div>
    </form>
  );
}


