"use client";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [type, setType] = useState("beatmaker");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const payload = {
        nom,
        prenom,
        pseudo,
        email,
        password,
        telephone,
        type,
        avatar: avatar || "https://via.placeholder.com/150", // Avatar par défaut si vide
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Compte créé avec succès :", data);

        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la création du compte :", errorData.message || "Échec.");
        setError(errorData.message || "Une erreur s'est produite.");
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
      setError("Une erreur s'est produite lors de la requête.");
    }
  };

  return (
    <>
      <div className="hidden lg:flex lg:flex-1 pl-10 pt-4 bg-white">
        <a href="/" className="text-sm font-semibold text-gray-900">
          <span aria-hidden="true" className="text-2xl">
            &larr;
          </span>
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
                    <option value="beatmaker">Beatmaker</option>
                    <option value="client">Client</option>
                  </select>
                </div>
              </div>

              {/* Composant Dropzone pour l'upload de cover */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou faites glisser et déposez
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = () => setAvatar(reader.result as string);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </label>
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
