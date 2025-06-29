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
    id_user: string;
}

export interface User {
    id_user: number;
    nom: string;
    prenom: string;
    pseudo: string;
    email: string;
    telephone: string;
    avatar: string;
}

export interface LicenceTrack {
    id_licence_track: number;
    type: string;
    prix: string;
}

export default function TrackIdPage() {
    const { id } = useParams();
    const [track, setTrack] = useState<Track | null>(null);
    const [user, setUser] = useState<User | null>(null); 
    const [licenceTrack, setLicenceTrack] = useState<LicenceTrack[]>([]);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchTrackById = async () => {
            try {
                // Récupération des informations du morceau (track) depuis l'API
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/track/${id}`
                );
                // Vérifie si la réponse est correcte (statut HTTP 2xx)
                if (!response.ok) {
                    console.error("Erreur lors de la récupération du morceau:", response.statusText);
                    return; // Stop la fonction en cas d'erreur
                }
                // Convertit les données du morceau en objet de type Track
                const trackData: Track = await response.json();
                // Met à jour l'état avec les données du morceau
                setTrack(trackData);
                // Récupération des informations de l'utilisateur associé au morceau
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/${trackData.id_user}`
                );
                // Vérifie si la réponse utilisateur est correcte
                if (!userResponse.ok) {
                    console.error("Erreur lors de la récupération de l'utilisateur:", userResponse.statusText);
                    return; // Stop la fonction en cas d'erreur
                }
                // Convertit les données de l'utilisateur en objet de type User
                const userData: User = await userResponse.json();
                // Met à jour l'état avec les données de l'utilisateur
                setUser(userData);
                // Récupération des licences associées au morceau
                const licenceResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/licence_track/${trackData.id_track}`
                );
                // Vérifie si la réponse des licences est correcte
                if (!licenceResponse.ok) {
                    console.log("Erreur lors de la récupération des licences:", licenceResponse.statusText);
                    return; // Stop la fonction en cas d'erreur
                }
                // Convertit les données des licences en tableau d'objets de type LicenceTrack
                const licences: LicenceTrack[] = await licenceResponse.json();
                // Met à jour l'état avec les licences associées au morceau
                setLicenceTrack(licences);
            } catch (error) {
                // Capture et affiche toute erreur inattendue (par exemple, problème réseau)
                console.error("Erreur inattendue:", error);
            }
        };
    
        // Appelle la fonction pour récupérer les données
        fetchTrackById();
    }, [id]); // Déclenche l'effet lorsque l'ID change
    
    const handleAddLicenceToCart = (licence: LicenceTrack) => {
        if (!track) return;

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        const newCartItem = {
            id_track: track.id_track,
            titre: track.titre,
            date: track.date,
            type: track.type,
            cover: track.cover,
            price: licence.prix, // Prix de la licence
            licence: licence.type, // Type de la licence
            id_licence_track: licence.id_licence_track, // Ajout pour identifier les licences
        };

        // Filtrer pour retirer toute licence existante pour le même id_track
        const updatedCart = existingCart.filter(
            (item: { id_track: number }) => item.id_track !== track.id_track
        );

        // Ajouter l'élément mis à jour
        updatedCart.push(newCartItem);

        // Sauvegarder dans le localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Notification de succès
        setNotification(
            `"${track.titre}" ajouté au panier pour ${licence.prix}€ avec la licence "${licence.type}".`
        );

        // Réinitialiser la notification après un délai
        setTimeout(() => {
            setNotification(null);
            window.location.reload();
        }, 3000);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl bg-white mx-auto px-6 py-8">
                {notification && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
                        {notification}
                    </div>
                )}
                {track ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1 flex flex-col items-center">
                            <img
                                src={track.cover}
                                alt={`Cover de ${track.titre}`}
                                className="w-full max-w-xs rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="pl-20">
                            <h1 className="text-2xl font-bold text-gray-800">{track.titre}</h1>
                            <p className="text-gray-600 mt-2">
                                <strong>Auteur :</strong> {user?.pseudo || "Auteur inconnu"}
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
                                    onClick={() => handleAddLicenceToCart(licence)}
                                    className="p-4 border border-gray-300 rounded-lg text-center text-black text-lg font-medium hover:bg-gray-100"
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
