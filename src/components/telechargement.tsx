// src/components/telechargement.tsx

import Image from 'next/image'

export default function Telechargement() {
  return (
    <div className="bg-white pt-16 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row items-center lg:items-start ">
        
        {/* Section texte avec un padding top plus important pour mieux aligner avec le trait bleu */}
        <div className="max-w-md text-center lg:text-left  lg:pt-32">
          <h2 className="text-3xl font-semibold text-black mb-4">Installer l'application</h2>
          <p className="text-gray-700 mb-12">
            Ne manquez jamais un Beat. Accédez à notre marché, connectez-vous avec d'autres créateurs, le tout depuis le confort de votre téléphone.
          </p>
          
          {/* Boutons de téléchargement avec taille réduite */}
          <div className="flex justify-center lg:justify-start space-x-4">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <Image src="/googleplay.png" alt="Google Play" width={120} height={40} className="w-auto h-auto" />
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
              <Image src="/appstore.png" alt="App Store" width={120} height={40} className="w-auto h-auto" />
            </a>
          </div>
        </div>

        {/* Section image téléphone */}
        <div className="flex-shrink-0">
          <Image src="/phones-studio.png" alt="Aperçu de l'application sur téléphone" width={300} height={600} className="w-auto h-auto" />
        </div>
      </div>
    </div>
  )
}
