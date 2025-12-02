import RentManagementClient from './RentManagement.client';

export default function AdminRentalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Rent Management</h1>
        <p className="mt-4 text-slate-600">View and manage rentals for administrator items.</p>
      </header>

      <section className="mt-8">
        <RentManagementClient />
      </section>
    </div>
  );
}
