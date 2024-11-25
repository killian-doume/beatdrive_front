import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Définition de l'interface pour un morceau
interface Track {
  id_track: number; // L'identifiant unique pour le morceau
  titre: string; // Le titre du morceau
  id_user: number; // L'identifiant de l'utilisateur associé
  cover: string; // L'image du morceau
}

interface User {
  id_user: number;
  nom: string;
  prenom: string;
  pseudo: string;
  email: string;
  telephone: string;
  avatar: string;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [userPseudoMap, setUserPseudoMap] = useState<Record<number, string>>(
    {}
  ); // Map pour associer id_user à pseudo
  const router = useRouter();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/track/limit/5`
        );
        const data: Track[] = await response.json();
        setTracks(data);

        // Après avoir récupéré les morceaux, récupérer les pseudos utilisateurs
        const userPseudoPromises = data.map(async (track) => {
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/${track.id_user}`
          );
          const userData: User = await userResponse.json();
          return { id_user: track.id_user, pseudo: userData.pseudo };
        });

        // Résoudre toutes les promesses et mettre à jour la map des pseudos
        const userPseudoResults = await Promise.all(userPseudoPromises);
        const pseudoMap: Record<number, string> = {};
        userPseudoResults.forEach(({ id_user, pseudo }) => {
          pseudoMap[id_user] = pseudo;
        });

        setUserPseudoMap(pseudoMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des morceaux ou utilisateurs :", error);
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
              onClick={() => router.push(`/track/${track.id_track}`)}
            >
              <img
                src={track.cover || "/default-cover.jpg"}
                alt={track.titre}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold text-black mb-1">{track.titre}</h2>
              <p className="text-gray-500 mb-2">
                By : {userPseudoMap[track.id_user] || "Utilisateur inconnu"}
              </p>
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
