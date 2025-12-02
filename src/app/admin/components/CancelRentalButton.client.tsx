"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  rentalId: string;
  csrf: string;
  buttonClassName?: string;
  label?: string;
};

export default function CancelRentalButton({ rentalId, csrf, buttonClassName, label }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onClick() {
    if (submitting) return;
    const confirmed = window.confirm("Are you sure you want to cancel this rental?");
    if (!confirmed) return;
    try {
      setSubmitting(true);
      const form = new FormData();
      form.set("csrf", csrf);
      const res = await fetch(`/api/admin/rentals/${rentalId}/cancel`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        // Optional: surface error to the user
        console.error("Failed to cancel rental", await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={submitting}
      className={buttonClassName ?? "rounded-lg border px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"}
    >
      {label ?? "Cancel"}
    </button>
  );
}


