import Header from '@/components/header';

const CGV = () => {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Header/>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Conditions Générales de Vente</h1>
        <p className="text-gray-600 mb-6">Dernière mise à jour : {today}</p>

        <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
        <p className="text-gray-700 mb-6">
          Les présentes conditions générales de vente (CGV) régissent les transactions effectuées sur notre site, dédié
          à la vente de productions musicales et de licences associées.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Tarification et offres</h2>
        <p className="text-gray-700 mb-6">
          Les prix sont indiqués en euros (€), toutes taxes comprises (TTC). Les éventuelles promotions ou remises sont
          clairement affichées sur les pages produit.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Paiement</h2>
        <p className="text-gray-700 mb-6">
          Les paiements sont réalisés de manière sécurisée via Stripe . Une facture
          est envoyée par email après validation de chaque commande.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Livraison des tracks</h2>
        <p className="text-gray-700 mb-6">
          Les productions musicales sont livrées immédiatement après validation du paiement sous forme de lien
          de téléchargement sécurisé.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
        <p className="text-gray-700 mb-6">
          Les droits d’utilisation des tracks sont définis par les termes de la licence sélectionnée (exemple : licence
          exclusive ou non-exclusive). Toute utilisation non conforme expose l'utilisateur à des sanctions légales.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Droit de rétractation</h2>
        <p className="text-gray-700 mb-6">
          Conformément aux dispositions relatives aux contenus numériques, le droit de rétractation ne s'applique pas
          après le téléchargement des tracks.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Litiges</h2>
        <p className="text-gray-700">
          En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents
          seront ceux du siège social de notre société.
        </p>
      </div>
    </>
  );
};

export default CGV;
