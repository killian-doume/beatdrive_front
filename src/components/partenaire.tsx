import Image from 'next/image'

export default function Partenaire() {
  return (
    <div className="bg-white py-8">
      

      <h2 className="text-2xl font-semibold text-center text-black mb-8">Partenaire</h2>
      

      <div className="flex justify-center items-center gap-14 flex-wrap">
        
        <div className="w-[20%] md:w-[15%] lg:w-[10%]">
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
            src="/ArtMeet.ico" 
            alt="Artmeet" 
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
