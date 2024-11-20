import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Définition de l'interface pour un morceau
interface Track {
  id_track: number; // L'identifiant unique pour le morceau
  titre: string; // Le titre du morceau
  user: {
    pseudo: string; // Le pseudo de l'utilisateur
  };
  cover: string; // L'image du morceau
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Récupération des données depuis l'API
    const fetchTracks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/track/limit/5`
        );
        const data: Track[] = await response.json(); // Type de réponse attendu : Track[]
        setTracks(data); // Mise à jour de l'état avec les morceaux
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-4">Morceaux en tendance</h1>
        <div className="mt-6 text-right">
          <Link
            href="/track"
            className="text-black hover:underline font-medium"
          >
            Voir plus
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id_track}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
              onClick={() => router.push(`/track/${track.id_track}`)} // Redirection vers la page de détail
            >
              <img
                src={track.cover } // Si l'image est manquante, affiche une image par défaut
                alt={track.titre}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold text-black mb-1">{track.titre}</h2>
              <p className="text-gray-500 mb-2">By : {track.user.pseudo}</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                Voir les détails
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
