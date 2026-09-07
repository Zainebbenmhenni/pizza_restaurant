export function Footer() {
  return (
    <footer id="contact" className="border-t border-crust bg-crust/40 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 font-body text-sm text-semola/80 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-display text-lg text-mozza">Forno Rosso</h3>
          <p>12 rue des Artisans, 75011 Paris</p>
          <p>Ouvert tous les jours, 18h30 – 23h00</p>
        </div>
        <div>
          <h3 className="mb-3 font-display text-lg text-mozza">Contact</h3>
          <p>01 84 20 09 17</p>
          <p>contact@forno-rosso.fr</p>
        </div>
        <div>
          <h3 className="mb-3 font-display text-lg text-mozza">Livraison</h3>
          <p>Paris 11e, 3e, 10e — 30 à 45 min</p>
          <p>Commande minimum 15 €</p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-semola/40">
        © {new Date().getFullYear()} Forno Rosso — projet de démonstration
      </p>
    </footer>
  );
}
