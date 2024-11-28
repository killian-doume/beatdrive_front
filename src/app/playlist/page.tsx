"use client";

import Header from "@/components/header";
import PageError from "@/components/pageerror";
import { faPause, faPlay, faTimes, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Track {
  date: number;
  id_track: number;
  titre: string;
  cover: string;
  audio: string;
  genre: string;
  type: string;
  cle: string;
  id_user: string;
  createdAt: string;
  user: string;
}

function AudioPlayer({ track, onClose }: { track: Track; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume (1 = 100%)
  const audioRef = useState(new Audio(track.audio))[0];

  useEffect(() => {
    audioRef.volume = volume;
    if (isPlaying) {
      audioRef.play();
    } else {
      audioRef.pause();
    }

    return () => {
      audioRef.pause();
      audioRef.currentTime = 0; // Réinitialiser la piste
    };
  }, [isPlaying, audioRef, volume]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-4 py-2 flex items-center justify-between shadow-lg h-16">
      <div className="flex items-center">
        <img src={track.cover} alt="Track cover" className="w-10 h-10 rounded-md" />
        <div className="ml-4 text-xs">
          <p className="font-semibold">{track.titre}</p>
          <p className="text-gray-400">{track.user}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={() => setIsPlaying(!isPlaying)} className="text-lg mx-2">
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faVolumeUp} className="mr-2" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16"
        />
        <button onClick={onClose} className="ml-4 text-lg">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [visibleTracks, setVisibleTracks] = useState<Track[]>([]);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true); // Vérifie l'accès
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Vérifier si le type d'utilisateur est "beatmaker"
      if (parsedUser.type !== "beatmaker") {
        setIsAuthorized(false); // Accès interdit
      }
    } else {
      setIsAuthorized(false); // Non connecté
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return; // Ne pas exécuter si non autorisé

    const fetchTracks = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track/all/${parsedUser.id_user}`);
        const data: Track[] = await response.json();
        console.log(data);

        const sortedTracks = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTracks(sortedTracks);
        setVisibleTracks(sortedTracks);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchTracks();
  }, [isAuthorized]);

  const handlePlayTrack = (track: Track) => {
    if (activeTrack?.id_track !== track.id_track) {
      setActiveTrack(null);
      setTimeout(() => {
        setActiveTrack(track);
      }, 100);
    }
  };

  // Afficher la page d'erreur si non autorisé
  if (!isAuthorized) {
    return <PageError message="Vous devez être un beatmaker pour accéder à cette page." />;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTracks.map((track) => (
              <div
                key={track.id_track}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 text-white"
              >
                {/* Titre au-dessus de la photo */}
                <p className="text-black font-semibold text-lg mb-2">{track.titre}</p>
                <div className="relative w-full h-48 mb-4 group">
                  <img
                    src={track.cover}
                    alt={track.titre}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>

                <a
                  href={`/playlist/${track.id_track}`}
                  className="bg-indigo-600 text-white w-full px-6 py-2 rounded-md hover:bg-indigo-500 flex items-center justify-center gap-2"
                >
                  Modifier
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeTrack && <AudioPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />}
    </>
  );
}
