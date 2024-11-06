'use client'
import {
  PopoverGroup
} from '@headlessui/react'
import Link from 'next/link'

export default function header() {


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

          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <a href="/track" className="text-sm/6 font-semibold text-gray-900">
              Tracks
            </a>
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              A propos
            </a>
            
              <Link href="/pricing" className="text-sm/6 font-semibold text-gray-900">
                Pricing
              </Link>
           
          </PopoverGroup>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/login" className="text-sm font-semibold text-gray-900">
              Connexion <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}
