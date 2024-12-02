import Header from '@/components/header';
import Head from 'next/head';

const CGU = () => {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
     <Header/>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-600 mb-6">Dernière mise à jour : {today}</p>

        <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
        <p className="text-gray-700 mb-6">
          Les présentes CGU définissent les conditions d’utilisation du site dédié à l’achat de productions musicales
          et de licences.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Accès au site</h2>
        <p className="text-gray-700 mb-6">
          L’accès au site est libre et gratuit. Cependant, certaines fonctionnalités, telles que l'achat et le
          téléchargement de tracks, nécessitent la création d’un compte utilisateur.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Création de compte</h2>
        <p className="text-gray-700 mb-6">
          Les utilisateurs s’engagent à fournir des informations exactes lors de la création de leur compte et à
          maintenir la confidentialité de leurs identifiants.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
        <p className="text-gray-700 mb-6">
          Les contenus disponibles sur ce site, y compris les tracks, sont protégés par le droit d'auteur. Toute
          reproduction ou distribution non autorisée est strictement interdite.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2>
        <p className="text-gray-700 mb-6">
          Le site ne peut être tenu responsable des interruptions temporaires de service ni des dommages résultant d'un
          usage non conforme du site.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Modifications</h2>
        <p className="text-gray-700">
          Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés via une
          notification sur le site.
        </p>
      </div>
    </>
  );
};

export default CGU;
