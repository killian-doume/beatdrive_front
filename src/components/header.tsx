'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Interface définissant les propriétés de l'utilisateur
interface User {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  adresse_facturation: string | null;
  adresse_livraison: string | null;
  authorities: { authority: string }[];
  avatar: string | null;
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  id_user: number;
  nom: string;
  prenom: string;
  pseudo: string;
  telephone: string;
  type: string;
  username: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Déclare l'utilisateur connecté

  useEffect(() => {
    // Vérifie si un utilisateur est stocké dans le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser); // Parse les données utilisateur
        setUser(parsedUser); // Met à jour l'état utilisateur
        setIsAuthenticated(true); // L'utilisateur est authentifié
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur :', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Fonction pour gérer la déconnexion
  const handleSignOut = () => {
    // Supprime les données utilisateur du Local Storage
    localStorage.removeItem('user');

    // Réinitialise l'état
    setIsAuthenticated(false);
    setUser(null);

    // Recharge la page pour refléter les changements
    window.location.reload();
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

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link href="/track" className="text-sm font-semibold text-gray-900">
            Track
          </Link>
          <Link href="/pricing" className="text-sm font-semibold text-gray-900">
            Prix
          </Link>
          <Link href="/about" className="text-sm font-semibold text-gray-900">
            A propos
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <Link href="/panier" className="text-gray-900 hover:text-gray-700">
            <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
          </Link>

          {isAuthenticated ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="User Avatar"
                    src={user?.avatar || "https://via.placeholder.com/150"} // Avatar dynamique ou image par défaut
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                {user?.pseudo && (
                  <MenuItem>
                    <div className="block px-4 py-2 text-sm text-center text-gray-700">
                      {user.pseudo} {/* Pseudo de l'utilisateur connecté */}
                    </div>
                  </MenuItem>
                )}
                <MenuItem>
                  <Link
                    href="/mon_compte"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon compte
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-gray-100"
                  >
                    Sign out
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
                    <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-700" aria-hidden="true" />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2 space-y-2">
                    <Link href="/track" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      Track
                    </Link>
                    <Link href="/pricing" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      Prix
                    </Link>
                    <Link href="/about" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      A propos
                    </Link>
                  </Disclosure.Panel>
                </Disclosure>
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar */}
                    <img
                      alt="User Avatar"
                      src={user?.avatar || "https://via.placeholder.com/150"} // Avatar dynamique ou image par défaut
                      className="h-16 w-16 rounded-full"
                    />
                    {/* Pseudo */}
                    <div className="text-sm font-semibold text-gray-700">{user?.pseudo}</div>
                    {/* Mon compte */}
                    <Link
                      href="/mon_compte"
                      className="block rounded-lg px-4 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Mon compte
                    </Link>
                    {/* Sign out */}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left rounded-lg px-4 py-2 text-base text-center font-semibold text-red-500 hover:text-red-600 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
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
