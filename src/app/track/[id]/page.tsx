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
    const [licenceTrack, setLicenceTrack] = useState<LicenceTrack[]>([]);

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

                // Récupérer les licences après avoir chargé le track
                const licenceResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/licence_track/${data.id_track}`
                );
                if (!licenceResponse.ok) {
                    throw new Error("Erreur lors de la récupération des licences");
                }
                const licences: LicenceTrack[] = await licenceResponse.json();
                setLicenceTrack(licences);
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchTrackById();
    }, [id]);

    return (
        <>
            <Header />
            <div className="max-w-6xl bg-white mx-auto px-6 py-8">
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
                        <div className="pl-20 ">
                            <h1 className="text-2xl font-bold text-gray-800">{track.titre}</h1>
                            <p className="text-gray-600 mt-2">
                                <strong>Auteur :</strong> {track.user.nom} {track.user.prenom}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Description :</strong> {track.description}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Bpm :</strong> {track.bpm}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Key :</strong> {track.cle}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Date publication :</strong> {track.date}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Genre :</strong> {track.genre}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Type :</strong> {track.type}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Chargement...</p>
                )}
                {track && (
                    <div className="col-span-2 pt-14 space-y-6">
                        <audio
                            controls
                            className="w-full h-12 rounded-lg shadow-inner bg-gray-100"
                        >
                            <source src={track.audio} type="audio/mpeg" />
                            Votre navigateur ne supporte pas la lecture audio.
                        </audio>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Licence</h1>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {licenceTrack.map((licence) => (
                                <button
                                    key={licence.id_licence_track}
                                    className="p-4 border border-gray-300 rounded-lg  text-center text-black text-lg font-medium hover:bg-gray-100"
                                >
                                    {licence.type} <br />{licence.prix} €
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
