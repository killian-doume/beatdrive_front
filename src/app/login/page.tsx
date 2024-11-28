"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    // Empêche le comportement par défaut du formulaire (soumission et rechargement de la page)
    e.preventDefault();
    try {
        // Effectue une requête POST vers l'API pour tenter une connexion
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account`, {
            method: "POST", // Méthode HTTP pour envoyer des données
            headers: {
                "X-Requested-With": "XMLHttpRequest", // Indique que la requête est faite par JavaScript
                "Content-Type": "application/json", // Type des données envoyées : JSON
                "Authorization": "Basic " + btoa(email + ':' + password) // Encode l'email et le mot de passe en Base64 pour l'authentification
            },
            credentials: 'include' // Inclut les cookies ou informations d'identité dans la requête
        });
        // Vérifie si la requête a réussi
        if (response.ok) {
            // Convertit la réponse JSON en un objet JavaScript
            const data = await response.json();
            console.log("Connexion réussie :", data);
            // Stocke l'identifiant utilisateur (id_user) dans le Local Storage
            localStorage.setItem('id_user', data.id_user || ''); 
            // Filtre les données utilisateur nécessaires
            const filteredData = {
                adresse_facturation: data.adresse_facturation || null, // Adresse de facturation (si disponible)
                adresse_livraison: data.adresse_livraison || null, // Adresse de livraison (si disponible)
                avatar: data.avatar, // URL de l'avatar de l'utilisateur
                email: data.email, // Adresse email
                id_user: data.id_user, // Identifiant utilisateur
                nom: data.nom, // Nom
                prenom: data.prenom, // Prénom
                pseudo: data.pseudo, // Pseudo
                telephone: data.telephone, // Numéro de téléphone
                type: data.type, // Type d'utilisateur (ex. admin, utilisateur normal, etc.)
                username: data.username // Nom d'utilisateur
            };
            // Stocke les données utilisateur filtrées dans le Local Storage sous forme de chaîne JSON
            localStorage.setItem("user", JSON.stringify(filteredData));
            // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
            router.push("/");
        } else {
            // Si la requête échoue, récupère les détails de l'erreur
            const errorData = await response.json();
            console.log("Erreur lors de la connexion :", errorData.message || "Échec de la connexion.");
        }
    } catch (err) {
        // Capture et affiche toute erreur survenue lors de la requête
        console.error("Erreur lors de la requête :", err);
    }
};



  return (
    <>
      <div className="hidden lg:flex lg:flex-1 pl-10 pt-4 bg-white">
        <a href="/" className="text-sm font-semibold text-gray-900">
          <span aria-hidden="true" className="text-2xl">&larr;</span>
        </a>
      </div>

      <div className="flex min-h-full bg-white flex-1 flex-col justify-center py-2 sm:px-6 lg:px-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/Beatdrivelogo.ico"
            className="mx-auto w-auto"
          />
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Se connecter à votre compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Connexion
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => router.push('/inscription')}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Inscription
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
