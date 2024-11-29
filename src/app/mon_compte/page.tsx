"use client";

import Header from "@/components/header";
import { useState, useEffect } from "react";

interface User {
  nom: string;
  prenom: string;
  email: string;
  username: string;
  telephone: string;
  pseudo: string;
  adresse_facturation: string | null;
  adresse_livraison: string | null;
  avatar: string | null;
  type: string;
  id_user: number;
}

interface Commande {
  date: string;
  nombre_total: number;
  prix_total: number;
}

export default function MonCompte() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); // Aperçu de l'avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Fichier avatar
  const [compte, setcompte] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState<User>({
    nom: "",
    prenom: "",
    email: "",
    username: "",
    telephone: "",
    pseudo: "",
    adresse_facturation: "",
    adresse_livraison: "",
    avatar: null,
    type: "",
    id_user: 0,
  });

  const [activeSection, setActiveSection] = useState<"account" | "password" | "delete" | "commande" | "compte">();

  useEffect(() => {
    if (activeSection === "commande") {
      fetchCommandes();
    }
  }, [activeSection]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        nom: parsedUser.nom || "",
        prenom: parsedUser.prenom || "",
        email: parsedUser.email || "",
        username: parsedUser.username || "",
        telephone: parsedUser.telephone || "",
        pseudo: parsedUser.pseudo || "",
        adresse_facturation: parsedUser.adresse_facturation || "",
        adresse_livraison: parsedUser.adresse_livraison || "",
        avatar: parsedUser.avatar || null,
        type: parsedUser.type || "",
        id_user: parsedUser.id_user,
      });
    } else {
      console.error("Aucun utilisateur trouvé dans le localStorage");
      setIsAuthorized(false);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier avatar est trop volumineux (max 5MB).");
        return;
      }
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const fetchCommandes = async () => {
    setIsLoading(true);

    try {
      const userId = user?.id_user || localStorage.getItem("id_user");

      if (!userId || userId === "0" || userId === "") {
        alert("Erreur : ID utilisateur manquant. Veuillez vérifier vos informations de connexion.");
        throw new Error("ID utilisateur manquant");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/detail_commande/all/${userId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des commandes");
      }

      const data = await response.json();
      setCommandes(data);
    } catch (error) {
      console.log("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };



  // Récupération des utilisateurs pour la gestion des comptes
  const fetchCompte = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      const data: User[] = await response.json();
      setcompte(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des comptes :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Suppression d'un utilisateur via API
  const deleteUser = async (id_user: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id_user}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }
      alert("Utilisateur supprimé avec succès !");
      setcompte((prevUsers) => prevUsers.filter((user) => user.id_user !== id_user));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Activer la gestion des comptes
  useEffect(() => {
    if (activeSection === "compte") {
      fetchCompte();
    }
  }, [activeSection]);


  const handleInputChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Créer un objet FormData pour gérer les données utilisateur et l'avatar
      const formData = new FormData();

      // Ajouter les données utilisateur
      formData.append(
        "user",
        JSON.stringify({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          pseudo: user.pseudo,
          adresse_facturation: user.adresse_facturation || null,
          adresse_livraison: user.adresse_livraison || null,
          type: user.type,
        })
      );

      // Ajouter l'avatar si un fichier a été sélectionné
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id_user}`, {
        method: "PUT",
        credentials: "include", // Inclut les cookies si nécessaire
        body: formData, // Envoie le FormData
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Erreur backend :", error);
        throw new Error("Erreur lors de la mise à jour du compte");
      }

      const updatedUser = await response.json();

      // Mise à jour du localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Optionnel : mettre à jour l'état utilisateur
      setUser({
        ...user,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        pseudo: updatedUser.pseudo,
        adresse_facturation: updatedUser.adresse_facturation,
        adresse_livraison: updatedUser.adresse_livraison,
        type: updatedUser.type,
        avatar: updatedUser.avatar, // Met à jour l'avatar si modifié
      });

      alert("Modifications enregistrées avec succès !");

      // Rechargement de la page
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id_user}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Erreur backend :", error);
        throw new Error("Erreur lors de la suppression du compte.");
      }

      // Supprimer le compte du localStorage
      localStorage.removeItem("user");

      alert("Compte supprimé avec succès. Vous allez être redirigé vers la page d'accueil.");

      // Redirection vers la page d'accueil
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la suppression de votre compte.");
    }
  };

  if (!isAuthorized) {
    return (
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Accès interdit
          </h1>
          <p className="mt-6 text-lg font-medium text-gray-500">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/login"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Aller à la page de connexion
            </a>
            <a href="/" className="text-sm font-semibold text-gray-900">
              Retourner à l'accueil <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <div className="text-black bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-6">
          <h1 className="text-2xl font-semibold mb-8">Paramètres du compte</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-md text-center ${activeSection === "commande"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              onClick={() => setActiveSection("commande")}
            >
              Historique de commande
            </button>
            {user.type === "admin" && (
              <button
                className={`flex-1 min-w-[120px] px-4 py-2 rounded-md text-center ${activeSection === "compte"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                onClick={() => setActiveSection("compte")}
              >
                Gestion des comptes
              </button>
            )}
            <button
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-md text-center ${activeSection === "account"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              onClick={() => setActiveSection("account")}
            >
              Compte
            </button>
            <button
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-md text-center ${activeSection === "password"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              onClick={() => setActiveSection("password")}
            >
              Mot de passe
            </button>
            <button
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-md text-center ${activeSection === "delete"
                 ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              onClick={() => setActiveSection("delete")}
            >
              Supprimer compte
            </button>
          </div>

          {activeSection === "commande" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Historique des commandes</h2>
              {isLoading ? (
                <p>Chargement...</p>
              ) : (
                <table className="table-auto w-full bg-white shadow rounded-md">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Nombre Total</th>
                      <th className="px-4 py-2">Prix Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandes.length > 0 ? (
                      commandes.map((commande, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{commande.date}</td>
                          <td className="px-4 py-2">{commande.nombre_total}</td>
                          <td className="px-4 py-2">{Number(commande.prix_total).toFixed(2)} €</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 text-center" colSpan={3}>
                          Aucune commande trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeSection === "compte" && (
            <div className="overflow-x-auto">
              {isLoading ? (
                <p className="text-center text-gray-500">Chargement...</p>
              ) : (
                <table className="table-auto w-full bg-white shadow-md rounded-md">
                  <thead>
                    <tr className="bg-gray-200 text-left text-sm md:text-base">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Nom</th>
                      <th className="px-4 py-2">Prénom</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compte.length > 0 ? (
                      compte
                        .filter((user) => user.type !== "admin") // Filtre les utilisateurs où type !== "admin"
                        .map((user) => (
                          <tr key={user.id_user} className="border-b hover:bg-gray-50 text-sm md:text-base">
                            <td className="px-4 py-2">{user.id_user}</td>
                            <td className="px-4 py-2">{user.nom}</td>
                            <td className="px-4 py-2">{user.prenom}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.type}</td>
                            <td className="px-4 py-2">
                              <button
                                className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}



          {/* Modal de confirmation */}
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirmation de suppression</h2>
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser.nom} {selectedUser.prenom} ?</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => deleteUser(selectedUser.id_user)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <form className="space-y-6" onSubmit={handleSaveChanges}>
              <div className="mb-6 flex items-center gap-6">
                <img
                  src={previewAvatar || user.avatar || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full bg-gray-300 object-cover"
                />
                <div>
                  <label className="block text-sm font-medium">Changer d'avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mt-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[

                  { label: "Nom", value: "nom" },
                  { label: "Prénom", value: "prenom" },
                  { label: "Email", value: "email" },
                  { label: "Téléphone", value: "telephone" },
                  { label: "Pseudo", value: "pseudo" },
                  { label: "Adresse de facturation", value: "adresse_facturation" },
                  { label: "Adresse de livraison", value: "adresse_livraison" },
                ].map(({ label, value }) => (
                  <div key={value}>
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type="text"
                      value={user[value as keyof User] || ""}
                      onChange={(e) => handleInputChange(value as keyof User, e.target.value)}
                      className="block w-full mt-2 rounded-md border border-black bg-indigo-50 py-2 px-3 shadow-sm text-gray-900 focus:border-black focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium">Type d'utilisateur</label>
                  <select
                    value={user.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="block w-full mt-2 rounded-md border border-black bg-indigo-50 py-2 px-3 shadow-sm text-gray-900 focus:border-black focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Beatmaker">Beatmaker</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                Enregistrer les modifications
              </button>
            </form>
          )}

          {activeSection === "password" && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Mot de passe actuel</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border border-black bg-indigo-50 py-2 px-3 shadow-sm text-gray-900 focus:border-black focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border border-black bg-indigo-50 py-2 px-3 shadow-sm text-gray-900 focus:border-black focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border border-black bg-indigo-50 py-2 px-3 shadow-sm text-gray-900 focus:border-black focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                Mettre à jour le mot de passe
              </button>
            </form>
          )}

          {activeSection === "delete" && (
            <div className="space-y-6">
              <p className="text-red-600 font-medium">
                Attention : La suppression de votre compte est irréversible.
              </p>
              <button
                className="w-full rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                onClick={handleDeleteAccount}
              >
                Supprimer mon compte
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
