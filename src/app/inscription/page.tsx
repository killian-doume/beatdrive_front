"use client";
import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [type, setType] = useState("beatmaker");
  const [cover, setCover] = useState<File | null>(null); // Fichier image
  const [previewCover, setPreviewCover] = useState<string | null>(null); // Aperçu de l'image
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!cover) {
      setError("Veuillez ajouter une couverture.");
      return;
    }

    try {
      // Crée un FormData pour inclure le fichier et les données utilisateur
      const formData = new FormData();
      const userPayload = {
        nom,
        prenom,
        pseudo,
        email,
        password,
        telephone,
        type,
      };
      formData.append("user", JSON.stringify(userPayload));
      formData.append("cover", cover);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: "POST",
        body: formData, // Envoi de FormData au lieu de JSON brut
      });

      if (response.ok) {
        setSuccess("Compte créé avec succès ! Vous allez être redirigé vers la page d'accueil.");
        setError(null);
        setTimeout(() => {
          router.push("/");
        }, 3000); // Redirection après 3 secondes
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur s'est produite.");
        setSuccess(null);
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la requête.");
      setSuccess(null);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Limite de 5MB
        alert("Le fichier de couverture est trop volumineux (max 5MB).");
        return;
      }
      setCover(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      {/* Modal de succès */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-green-600">Succès</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-4 text-gray-700">{success}</p>
          </div>
        </div>
      )}

      {/* Modal d'erreur */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-red-600">Erreur</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-4 text-gray-700">{error}</p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="hidden lg:flex lg:flex-1 pl-10 pt-4 bg-white">
        <a href="/" className="text-sm font-semibold text-gray-900">
          <span aria-hidden="true" className="text-2xl">&larr;</span>
        </a>
      </div>
      <div className="flex min-h-full bg-white flex-1 flex-col justify-center py-2 sm:px-6 lg:px-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img alt="Your Company" src="/Beatdrivelogo.ico" className="mx-auto w-auto" />
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Création de votre compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-900">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-900">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="pseudo" className="block text-sm font-medium text-gray-900">
                    Pseudo
                  </label>
                  <input
                    id="pseudo"
                    name="pseudo"
                    type="text"
                    required
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                    Retaper votre mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                    {passwordsMatch && (
                      <CheckIcon
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-900">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="text"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="Beatmaker">Beatmaker</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              </div>

              <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                <label className="block text-black font-medium mb-2">Cover (jpg):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="w-full text-sm"
                  required
                />
                {previewCover && (
                  <div className="mt-4">
                    <p className="text-black">Aperçu de l'image :</p>
                    <img
                      src={previewCover}
                      alt="Preview"
                      className="mt-2 max-w-full h-auto rounded"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <button
                  type="submit"
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
