import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faXTwitter, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        
        {/* Navigation principale */}
        <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
          <Link href="/track" className="text-gray-600 hover:text-gray-900">
            Track
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Prix
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            A propos
          </Link>
          <Link href="/mon_compte" className="text-gray-600 hover:text-gray-900">
            Mon compte
          </Link>
          <Link href="/cgv" className="text-gray-600 hover:text-gray-900">
            CGV
          </Link>
          <Link href="/cgu" className="text-gray-600 hover:text-gray-900">
            CGU
          </Link>
          
        </nav>

        {/* Liens sociaux avec Font Awesome */}
        <div className="mt-16 flex justify-center gap-x-10">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
            <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
            <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
            <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
            <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-center text-sm/6 text-gray-600">&copy; 2024 Beat Drive, Inc. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
