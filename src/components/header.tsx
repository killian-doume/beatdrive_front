'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel, Disclosure, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel, } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

interface User {
  adresse_facturation: string | null;
  adresse_livraison: string | null;
  avatar: string | null;
  email: string;
  id_user: number;
  nom: string;
  prenom: string;
  pseudo: string;
  telephone: string;
  type: string;
  username: string;
}

interface CartItem {
  id_track: number;
  titre: string;
  cover: string;
  price: string;
  licence: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPlaylistButton, setShowPlaylistButton] = useState(true);


  useEffect(() => {
    // Récupère les informations de l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Tente de convertir les données JSON en un objet utilisateur
        const parsedUser: User = JSON.parse(storedUser);
        // Met à jour l'état de l'utilisateur avec les données récupérées
        setUser(parsedUser);
        // Indique que l'utilisateur est authentifié
        setIsAuthenticated(true);

        // Si l'utilisateur possède un identifiant, vérifie l'état de sa playlist
        if (parsedUser.id_user) {
          fetchPlaylistStatus(parsedUser.id_user); // Fonction pour appeler l'API
        }
      } catch {
        // Si une erreur survient (ex : JSON invalide), désauthentifie l'utilisateur
        setIsAuthenticated(false);
      }
    }
    // Récupère les informations du panier depuis le localStorage
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        // Tente de convertir les données JSON en un tableau d'éléments de panier
        const parsedCart: CartItem[] = JSON.parse(cart);
        // Met à jour l'état avec les éléments du panier récupérés
        setCartItems(parsedCart);
      } catch {
        // Si une erreur survient (ex : JSON invalide), initialise un panier vide
        setCartItems([]);
      }
    }
  }, []); // Le tableau vide indique que cet effet s'exécute uniquement au montage du composant


  const handleSignOut = async () => {
    try {
      // Appeler l'API backend pour effectuer la déconnexion
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'POST', // Méthode POST est souvent utilisée pour /logout
        credentials: 'include', // Inclure les cookies dans la requête
      });

      // Vérification de la réponse
      if (!response.ok) {
        throw new Error(`Erreur lors de la déconnexion : ${response.statusText}`);
      }

      // Nettoyer les données côté client
      localStorage.removeItem('user');
      localStorage.removeItem('id_user');
      setIsAuthenticated(false);
      setUser(null);

      // Rediriger vers la page d'accueil
      window.location.assign('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Fonction pour vérifier l'existence de la playlist
  const fetchPlaylistStatus = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track/all/${userId}`);
      if (response.ok) {
        setShowPlaylistButton(true);
      } else if (response.status === 404) {
        setShowPlaylistButton(false);
      } else {
        console.error('Erreur inattendue lors de la vérification de la playlist:', response.status);
        setShowPlaylistButton(false);
      }
    } catch (error) {
      console.error('Erreur réseau ou autre lors de la vérification de la playlist:', error);
      setShowPlaylistButton(false);
    }
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id_track !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Beatdrive</span>
            <img alt="Beatdrive Logo" src="/Beatdrivelogo.ico" className="h-20 w-auto" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation pour les écrans de bureau */}
        <Popover className="hidden lg:flex lg:gap-x-12">
          {/* Lien vers la page "Track" */}
          <Link href="/track" className="text-sm font-semibold text-gray-900">
            Track
          </Link>

          {/* Lien vers la page "Prix" */}
          <Link href="/pricing" className="text-sm font-semibold text-gray-900">
            Prix
          </Link>

          {/* Lien vers la page "À propos" */}
          <Link href="/about" className="text-sm font-semibold text-gray-900">
            A propos
          </Link>
        </Popover>


        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          {/* Panier avec menu déroulant */}
          <Popover className="relative">
            <PopoverButton className="group -m-2 flex items-center p-2">
              <ShoppingBagIcon
                aria-hidden="true"
                className="h-6 w-6 text-gray-700 group-hover:text-gray-900"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {cartItems.length}
              </span>
            </PopoverButton>
            <PopoverPanel
              className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50"
            >
              <h2 className="sr-only">Panier</h2>
              {cartItems.length > 0 ? (
                <ul className="divide-y divide-gray-200 p-4">
                  {cartItems.map((item) => (
                    <li key={item.id_track} className="flex items-center py-4">
                      <img
                        alt={`Cover de ${item.titre}`}
                        src={item.cover}
                        className="h-16 w-16 flex-none rounded-md border border-gray-200"
                      />
                      <div className="ml-4 flex-auto">
                        <h3 className="font-medium text-gray-900">{item.titre}</h3>
                        <p className="text-sm text-gray-500">{item.price} € {item.licence}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id_track)}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer cet article"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-center text-gray-500">Votre panier est vide.</p>
              )}
              {cartItems.length > 0 && (
                <div className="p-4">
                  <Link
                    href="/panier"
                    className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Aller au panier
                  </Link>
                </div>
              )}
            </PopoverPanel>
          </Popover>

          {isAuthenticated ? (
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm">
                <span className="sr-only">Open user menu</span>
                <img
                  alt="User Avatar"
                  src={user?.avatar || 'https://via.placeholder.com/150'}
                  className="h-8 w-8 rounded-full"
                />
              </MenuButton>
              <MenuItems
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50"
              >
                <MenuItem>
                  {/* Conteneur pour afficher les informations utilisateur */}
                  <div className="flex items-center justify-center px-4 py-2 text-sm font-bold">
                    {/* Affiche le pseudo de l'utilisateur avec une couleur conditionnelle en fonction de son type */}
                    <span className={user?.type === "admin" ? "text-yellow-500" : "text-gray-700"}>
                      {user?.pseudo} {/* Pseudo de l'utilisateur (s'il existe) */}
                    </span>
                    {/* Si l'utilisateur est un administrateur, affiche une icône de couronne */}
                    {user?.type === "admin" && (
                      <img
                        src="https://png.pngtree.com/png-vector/20190128/ourlarge/pngtree-king-crown-for-symbol-and-icon-king-png-image_342262.jpg"
                        alt="Crown Icon" // Texte alternatif pour l'image
                        className="h-4 w-4 ml-2" // Taille de l'image et espacement à gauche
                      />
                    )}
                    {/* Si l'utilisateur est un beatmaker, affiche une icône de note de musique */}
                    {user?.type === "beatmaker" && (
                      <MusicalNoteIcon className="h-4 w-4 text-blue-500 ml-2" /> // Taille et couleur de l'icône
                    )}
                  </div>
                </MenuItem>


                <MenuItem>
                  <Link
                    href="/mon_compte"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon compte
                  </Link>
                </MenuItem>
                {user?.type === "beatmaker" && showPlaylistButton && (
                  <MenuItem>
                    <Link
                      href="/playlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Playlist
                    </Link>
                  </MenuItem>
                )}
                {user?.type === "beatmaker" && (
                  <MenuItem>
                    <Link
                      href="/upload"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Upload
                    </Link>
                  </MenuItem>
                )}
                <MenuItem>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-gray-900">
              Connexion <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>


      {/* Mobile Navigation */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Beatdrive</span>
              <img alt="Beatdrive Logo" src="/Beatdrivelogo.ico" className="h-20 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <Disclosure.Button className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Menu
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 space-y-2">
                    <Link
                      href="/track"
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Track
                    </Link>
                    <Link
                      href="/pricing"
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Prix
                    </Link>
                    <Link
                      href="/about"
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      A propos
                    </Link>
                  </Disclosure.Panel>
                </Disclosure>
              </div>
              <div className="py-6">
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Votre Panier</h3>
                    <ul className="space-y-4">
                      {cartItems.map((item) => (
                        <li key={item.id_track} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              alt={`Cover de ${item.titre}`}
                              src={item.cover}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900">{item.titre}</p>
                              <p className="text-sm text-gray-500">{item.price} €</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id_track)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/panier"
                      className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Aller au panier
                    </Link>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Votre panier est vide.</p>
                )}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <img
                        alt="User Avatar"
                        src={user?.avatar || 'https://via.placeholder.com/150'}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="flex items-center mt-2">
                        <p className="text-sm font-semibold text-gray-900">{user?.pseudo}</p>
                        {user?.type === "admin" && (
                          <img
                            src="https://png.pngtree.com/png-vector/20190128/ourlarge/pngtree-king-crown-for-symbol-and-icon-king-png-image_342262.jpg"
                            alt="Crown Icon"
                            className="h-4 w-4 ml-2"
                          />
                        )}
                        {user?.type === "beatmaker" && (
                          <MusicalNoteIcon className="h-4 w-4 text-blue-500 ml-2" />
                        )}
                      </div>
                    </div>

                    <Link
                      href="/mon_compte"
                      className="block rounded-lg px-4 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Mon compte
                    </Link>
                    {user?.type === "beatmaker" && showPlaylistButton && (
                      <Link
                        href="/playlist"
                        className="block rounded-lg px-4 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Playlist
                      </Link>
                    )}
                    {user?.type === "beatmaker" && (
                      <Link
                        href="/upload"
                        className="block rounded-lg px-4 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Upload
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full rounded-lg px-4 py-2 text-base font-semibold text-red-500 hover:bg-gray-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

    </header>
  );
}
