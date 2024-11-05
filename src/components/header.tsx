'use client'
import {
  PopoverGroup
} from '@headlessui/react'
import {
  Bars3Icon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Beatdrive</span>
              <img
                alt="Beatdrive Logo"
                src="/Beatdrivelogo.ico"
                className="h-20 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Tracks
            </a>
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              A propos
            </a>
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              <Link href="/pricing">
                Pricing
              </Link>
            </a>
          </PopoverGroup>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Connexion <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  )
}
