import React from "react";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for the site"
};

export default function TermsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Terms of Use</h1>
      <p>Welcome. These are the Terms of Use for this site. Please read them carefully.</p>

      <section>
        <h2>1. Acceptance</h2>
        <p>By using this site you agree to these terms.</p>
      </section>

      <section>
        <h2>2. Use</h2>
        <p>Do not use the site for unlawful purposes. Respect intellectual property and privacy.</p>
      </section>

      <section>
        <h2>3. Liability</h2>
        <p>The site is provided "as is" without warranties. Liability is limited to the fullest extent permitted by law.</p>
      </section>

      <footer style={{ marginTop: 24 }}>
        <small>Last updated: {new Date().toISOString().split("T")[0]}</small>
      </footer>
    </main>
  );
}
