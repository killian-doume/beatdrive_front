'use client'

import Header from '@/components/header'
import { useState, useEffect } from 'react'

interface User {
  nom: string
  prenom: string
  email: string
  username: string
  telephone: string
  pseudo: string
  adresse_facturation: string | null
  adresse_livraison: string | null
  avatar: string | null
  type: string
  id_user: number
}

export default function MonCompte() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [user, setUser] = useState<User>({
    nom: '',
    prenom: '',
    email: '',
    username: '',
    telephone: '',
    pseudo: '',
    adresse_facturation: '',
    adresse_livraison: '',
    avatar: null,
    type: '',
    id_user: 0,
  })

  const [activeSection, setActiveSection] = useState<'account' | 'password' | 'delete'>('account')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        nom: parsedUser.nom || '',
        prenom: parsedUser.prenom || '',
        email: parsedUser.email || '',
        username: parsedUser.username || '',
        telephone: parsedUser.telephone || '',
        pseudo: parsedUser.pseudo || '',
        adresse_facturation: parsedUser.adresse_facturation || '',
        adresse_livraison: parsedUser.adresse_livraison || '',
        avatar: parsedUser.avatar || null,
        type: parsedUser.type || '',
        id_user: parsedUser.id_user || 0,
      })
    } else {
      setIsAuthorized(false)
    }
  }, [])

  const handleInputChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value })
  }

  const handleAvatarChange = () => {
    const newAvatar = prompt('Entrez l’URL de votre nouvel avatar :')
    if (newAvatar) {
      setUser({ ...user, avatar: newAvatar })
    }
  }

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          pseudo: user.pseudo,
          adresse_facturation: user.adresse_facturation || null,
          adresse_livraison: user.adresse_livraison || null,
          type: user.type,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Erreur backend :", error);
        throw new Error("Erreur lors de la mise à jour du compte");
      }
  
      const updatedUser = await response.json();
      console.log("Mise à jour réussie :", updatedUser);
  
      // Met à jour l'état local avec les nouvelles données
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
      });
  
      alert("Modifications enregistrées avec succès !");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };
  


  if (!isAuthorized) {
    // Page d'erreur si l'utilisateur n'est pas connecté
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
    )
  }
  return (
    <>
      <Header />
      <div className="text-black bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-6">
          <h1 className="text-2xl font-semibold mb-8">Paramètres du compte</h1>

          {/* Menu */}
          <div className="flex gap-4 mb-8">
            <button
              className={`px-4 py-2 rounded-md ${activeSection === 'account'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              onClick={() => setActiveSection('account')}
            >
              Compte
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeSection === 'password'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              onClick={() => setActiveSection('password')}
            >
              Mot de passe
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeSection === 'delete'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              onClick={() => setActiveSection('delete')}
            >
              Supprimer compte
            </button>
          </div>

          {/* Formulaire dynamique */}
          {activeSection === 'account' && (
            <form className="space-y-6">
              {/* Avatar */}
              <div className="mb-6 flex items-center gap-6">
                <img
                  src={user.avatar || 'https://via.placeholder.com/100'}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full bg-gray-300 object-cover"
                />
                <div>
                  <button
                    type="button"
                    onClick={handleAvatarChange}
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-300"
                  >
                    Changer d'avatar
                  </button>
                </div>
              </div>

              {/* Informations utilisateur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Nom</label>
                  <input
                    type="text"
                    value={user.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Prénom</label>
                  <input
                    type="text"
                    value={user.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Téléphone</label>
                  <input
                    type="text"
                    value={user.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Pseudo</label>
                  <input
                    type="text"
                    value={user.pseudo}
                    onChange={(e) => handleInputChange('pseudo', e.target.value)}
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Adresse de facturation</label>
                  <input
                    type="text"
                    value={user.adresse_facturation || ''}
                    onChange={(e) =>
                      handleInputChange('adresse_facturation', e.target.value)
                    }
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Adresse de livraison</label>
                  <input
                    type="text"
                    value={user.adresse_livraison || ''}
                    onChange={(e) =>
                      handleInputChange('adresse_livraison', e.target.value)
                    }
                    className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  {/* Vérifier si user.type n'est pas "admin" */}
                  {user.type !== 'admin' && (
                    <div>
                      <label className="block text-sm font-medium">Type d'utilisateur</label>
                      <select
                        value={user.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="Beatmaker">Beatmaker</option>
                        <option value="Client">Client</option>
                      </select>
                    </div>
                  )}
                </div>

              </div>
              <button
                type="submit"
                onClick={handleSaveChanges}
                className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                Enregistrer les modifications
              </button>

            </form>
          )}

          {activeSection === 'password' && (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Mot de passe actuel</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="block w-full mt-2 rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

          {activeSection === 'delete' && (
            <div className="space-y-6">
              <p className="text-red-600 font-medium">
                Attention : La suppression de votre compte est irréversible.
              </p>
              <button
                className="w-full rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Supprimer mon compte
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
