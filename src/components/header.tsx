'use client'
import { PopoverGroup } from '@headlessui/react'
import Link from 'next/link'
import { ShoppingBagIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

export default function Header() {
  // Simule l'état d'authentification. Remplace cette logique par la vraie vérification d'authentification.
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérifie l'état de l'authentification (à adapter selon ton mécanisme d'authentification réel)
    // Par exemple, tu peux vérifier un token JWT ici.
    const token = localStorage.getItem('authToken') // Exemple de token dans localStorage
    setIsAuthenticated(!!token)
  }, [])

  return (
    <>
      <header className="bg-white">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Beatdrive</span>
              <img
                alt="Beatdrive Logo"
                src="/Beatdrivelogo.ico"
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <Link href="/track" className="text-sm/6 font-semibold text-gray-900">
              Tracks
            </Link>
            <Link href="/pricing" className="text-sm/6 font-semibold text-gray-900">
              Prix
            </Link>
            <Link href="/about" className="text-sm/6 font-semibold text-gray-900">
              A propos
            </Link>
          </PopoverGroup>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
            <Link href="/panier" className="text-gray-900 hover:text-gray-700">
              <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
            </Link>
            {isAuthenticated ? (
              <Link href="/profile" className="text-gray-900 hover:text-gray-700">
                <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-gray-900">
                Connexion <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
