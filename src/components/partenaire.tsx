// Importation du composant Image de Next.js pour gérer les images de manière optimisée
import Image from 'next/image'

// Déclaration de la fonction Partenaire qui retourne le composant
export default function Partenaire() {
  return (
    // Conteneur principal du composant avec un fond blanc et des marges en haut et en bas (padding)
    <div className="bg-white py-8">
      
      {/* Titre du composant, centré, avec une taille de police de 2xl et un espacement inférieur */}
      <h2 className="text-2xl font-semibold text-center text-black mb-8">Partenaire</h2>
      
      {/* Conteneur pour les logos avec une disposition en flex, centrage horizontal et vertical, 
          espacement entre les éléments, et alignement en plusieurs lignes si l'espace est limité */}
      <div className="flex justify-center items-center gap-14 flex-wrap">
        
        {/* Conteneur de chaque logo avec une largeur adaptable en fonction de la taille de l'écran */}
        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
          {/* Image du logo avec un rendu réactif qui s'adapte à la largeur du conteneur */}
          <Image 
            src="/Believe_Black.ico"                // Chemin vers l'image
            alt="Believe Logo"                       // Texte alternatif pour l'accessibilité
            layout="responsive"                      // Mode responsive pour que l'image s'adapte à son conteneur
            width={175} height={175}                 // Dimensions originales pour la proportion de l'image
            className="w-full h-auto"                // Largeur et hauteur automatiques pour occuper tout l'espace du conteneur
          />
        </div>

        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
          <Image 
            src="/Logo_WAGRAM_music.ico" 
            alt="Wagram Music Logo" 
            layout="responsive" 
            width={175} height={175} 
            className="w-full h-auto" 
          />
        </div>

        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
          <Image 
            src="/sony-music-entertainment1999.ico" 
            alt="Sony Music Logo" 
            layout="responsive" 
            width={175} height={175} 
            className="w-full h-auto" 
          />
        </div>

        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
          <Image 
            src="/Universal_Music_Group_logo.svg.ico" 
            alt="Universal Music Logo" 
            layout="responsive" 
            width={175} height={175} 
            className="w-full h-auto" 
          />
        </div>

        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
          <Image 
            src="/WarnerMusicGroup.ico" 
            alt="Warner Music Logo" 
            layout="responsive" 
            width={175} height={175} 
            className="w-full h-auto" 
          />
        </div>
      </div>
    </div>
  )
}
