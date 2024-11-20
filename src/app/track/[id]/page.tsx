'use client';

import Header from "@/components/header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface Track {
  id_track: number;
  titre: string;
  date: string;
  bpm: string;
  description: string;
  cle: string;
  genre: string;
  type: string;
  audio: string;
  cover: string;
  statut: string;
  user: {
    id_user: number;
    nom: string;
    prenom: string;
    pseudo: string;
    email: string;
    telephone: string;
    avatar: string;
  };
}
interface LicenceTrack {
  id_licence_track: number;
  type: string;
  prix: string;
}

export default function TrackIdPage() {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [licenceTrack, setLicenceTrack] = useState<LicenceTrack | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrackById = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/track/${id}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du track");
        }
        const data: Track = await response.json();
        setTrack(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    const fetchLicenceTrackById = async (id_track: number) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/licence_track/${id_track}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la licence track");
        }
        const data: LicenceTrack = await response.json();
        setLicenceTrack(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchTrackById().then(() => {
      if (track?.id_track) {
        fetchLicenceTrackById(track.id_track);
      }
    });
  }, [id, track?.id_track]);

  return (
    <>
      <Header />
      <div className="max-w-6xl bg-white mx-auto px-6 py-10">
        {track ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Section */}
            <div className="col-span-1 flex flex-col items-center">
              <img
                src={track.cover}
                alt={`Cover de ${track.titre}`}
                className="w-full max-w-xs rounded-lg shadow-lg"
              />
            </div>
            {/* Right Section */}
            <div className="col-span-2 space-y-6">
              <audio
                controls
                className="w-full h-12 rounded-lg shadow-inner bg-gray-100"
              >
                <source src={track.audio} type="audio/mpeg" />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Licence</h2>
                {licenceTrack && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-xl">
                      {licenceTrack.prix} €
                    </span>
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                      <span className="mr-2">🛒</span> Acheter
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg text-center text-lg font-medium hover:bg-gray-100">
                  1
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-center text-lg font-medium hover:bg-gray-100">
                  2
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-center text-lg font-medium hover:bg-gray-100">
                  3
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Chargement...</p>
        )}
        {track && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-800">{track.titre}</h1>
            <p className="text-gray-600 mt-2">
              <strong>Auteur :</strong> {track.user.nom} {track.user.prenom}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Description :</strong> {track.description}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
