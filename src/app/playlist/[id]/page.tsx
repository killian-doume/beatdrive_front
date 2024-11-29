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
    const [editedTrack, setEditedTrack] = useState<Track | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [licenceTrack, setLicenceTrack] = useState<LicenceTrack[]>([]);
    const [editingtrack, setEditingtrack] = useState(false);
    const [editinglicence, setEditinglicence] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [previewCover, setPreviewCover] = useState<string | null>(null);
    const [previewAudio, setPreviewAudio] = useState<string | null>(null);
    const [cover, setCover] = useState<File | null>(null); // Fichier image
    const [audioFile, setAudioFile] = useState<File | null>(null); // Fichier audio

    useEffect(() => {
        if (!id) return;

        const fetchTrackById = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/track/${id}`
                );
                if (!response.ok) {
                    console.error("Erreur lors de la récupération du morceau:", response.statusText);
                    return;
                }
                const trackData: Track = await response.json();
                setTrack(trackData);
                setEditedTrack(trackData);

                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/${trackData.id_user}`
                );
                if (userResponse.ok) {
                    const userData: User = await userResponse.json();
                    setUser(userData);
                }

                const licenceResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/licence_track/${trackData.id_track}`
                );
                if (licenceResponse.ok) {
                    const licences: LicenceTrack[] = await licenceResponse.json();
                    setLicenceTrack(licences);
                }
            } catch (error) {
                console.error("Erreur inattendue:", error);
            }
        };

        fetchTrackById();
    }, [id]);
    const handleEdittrack = () => {
        setEditingtrack(!editingtrack);
    };
    const handleEditlicence = () => {
        setEditinglicence(!editinglicence);
    };

    const handleChange = (field: keyof Track, value: string) => {
        if (editedTrack) {
            setEditedTrack({ ...editedTrack, [field]: value });
        }
    };
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
                alert("Le fichier de couverture est trop volumineux (max 5MB).");
                return;
            }
            setCover(file);
            setPreviewCover(URL.createObjectURL(file));
        }
    };
    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // Limite de 50MB
                alert("Le fichier audio est trop volumineux (max 50MB).");
                return;
            }
            setAudioFile(file);
            setPreviewAudio(URL.createObjectURL(file));
        }
    };

    const handleSaveTrack = async () => {
        if (!editedTrack) return;
        const formData = new FormData();
        formData.append("track", JSON.stringify(editedTrack));
        if (previewCover) {
            const coverBlob = await fetch(previewCover).then((res) => res.blob());
            formData.append("cover", coverBlob, "cover.jpg");
        }
        if (previewAudio) {
            const audioBlob = await fetch(previewAudio).then((res) => res.blob());
            formData.append("audio", audioBlob, "audio.mp3");
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/track/${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
            if (response.ok) {
                const updatedTrack = await response.json();
                setTrack(updatedTrack);
                setEditingtrack(false);
                setEditinglicence(false);
                setNotification("Mise à jour réussie !");
                console.log("Mise à jour de la cover avec la valeur : {}", updatedTrack);

                setTimeout(() => {
                    setNotification(null);
                    window.location.reload(); // Recharge la page
                }, 3000);
            } else {
                console.error("Erreur lors de la sauvegarde :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur inattendue :", error);
        }
    };
    const handleSaveLicence = async () => {
        try {
            // Gestion des PUT pour les licences existantes
            for (const licence of licenceTrack.filter((l) => l.id_licence_track)) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/licence_track/${licence.id_licence_track}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(licence),
                    }
                );

                if (!response.ok) {
                    console.error("Erreur lors de la mise à jour de la licence :", response.statusText);
                }
            }
            setNotification("Licences mises à jour avec succès !");
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Erreur inattendue lors de la mise à jour des licences :", error);
        }
    };

    const handleSavetrack = () => {
        handleSaveTrack();
    };
    const handleSavelicence = () => {

        handleSaveLicence();
    };

    const postNewLicence = async () => {
        if (!track) {
            console.error("Le track n'est pas disponible");
            return;
        }

        try {
            const newLicence = {
                track, // Inclut l'objet Track complet
                type: "", // Valeur par défaut pour le type
                prix: "", // Valeur par défaut pour le prix
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/licence_track`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLicence),
            });

            if (response.ok) {
                const createdLicence = await response.json();
                setLicenceTrack((prevLicences) => [...prevLicences, createdLicence]);
                setNotification("Nouvelle licence ajoutée avec succès !");
                console.log("Nouvelle licence créée avec la valeur : {}", createdLicence);
                setTimeout(() => {
                    setNotification(null);
                    window.location.reload(); // Recharger la page après succès
                }, 3000);
            } else {
                console.error("Erreur lors de la création de la licence :", response.statusText);
            }
        } catch (error) {
            console.error("Erreur inattendue lors de la création de la licence :", error);
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl bg-white mx-auto px-6 py-8 text-black">
                {notification && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
                        {notification}
                    </div>
                )}
                {track ? (
                    <div className="space-y-6">
                        {/* Cover */}
                        <div className="flex justify-center">
                            {editingtrack ? (
                                <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                                    <label className="block text-black font-medium mb-2">
                                        Cover (jpg):
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="w-full text-sm"
                                    />
                                    {previewCover && (
                                        <div className="mt-4">
                                            <img
                                                src={previewCover}
                                                alt="Preview"
                                                className="mt-2 max-w-full h-auto rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <img
                                    src={track.cover}
                                    alt={`Cover de ${track.titre}`}
                                    className="w-full max-w-xs rounded-lg shadow-lg"
                                />
                            )}
                        </div>

                        {/* Détails */}
                        <div>
                            <p>
                                <strong>Titre :</strong>{" "}
                                {editingtrack ? (
                                    <input
                                        type="text"
                                        value={editedTrack?.titre || ""}
                                        onChange={(e) => handleChange("titre", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                ) : (
                                    track.titre
                                )}
                            </p>
                            <p>
                                <strong>Bpm :</strong>{" "}
                                {editingtrack ? (
                                    <input
                                        type="text"
                                        value={editedTrack?.bpm || ""}
                                        onChange={(e) => handleChange("bpm", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                ) : (
                                    track.bpm
                                )}
                            </p>
                            <p>
                                <strong>Genre :</strong>{" "}
                                {editingtrack ? (
                                    <input
                                        type="text"
                                        value={editedTrack?.genre || ""}
                                        onChange={(e) => handleChange("genre", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                ) : (
                                    track.genre
                                )}
                            </p>
                            <p>
                                <strong>Type :</strong>{" "}
                                {editingtrack ? (
                                    <input
                                        type="text"
                                        value={editedTrack?.type || ""}
                                        onChange={(e) => handleChange("type", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                ) : (
                                    track.type
                                )}
                            </p>
                            <p>
                                <strong>Clé musicale:</strong>{" "}
                                {editingtrack ? (
                                    <select
                                        value={editedTrack?.cle || ""}
                                        onChange={(e) => handleChange("cle", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Sélectionnez une clé musicale</option>
                                        <option value="C">C</option>
                                        <option value="C#">C#</option>
                                        <option value="D">D</option>
                                        <option value="D#">D#</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                        <option value="F#">F#</option>
                                        <option value="G">G</option>
                                        <option value="G#">G#</option>
                                        <option value="A">A</option>
                                        <option value="A#">A#</option>
                                        <option value="B">B</option>
                                    </select>
                                ) : (
                                    track.cle
                                )}
                            </p>
                            <p>
                                <strong>Statut :</strong>{" "}
                                {editingtrack ? (
                                    <select
                                        value={editedTrack?.statut || ""}
                                        onChange={(e) => handleChange("statut", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="Disponible">Disponible</option>
                                        <option value="Non disponible">Non disponible</option>
                                    </select>
                                ) : (
                                    track.statut
                                )}
                            </p>

                            <p>
                                <strong>Description :</strong>{" "}
                                {editingtrack ? (
                                    <textarea
                                        value={editedTrack?.description || ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                ) : (
                                    track.description
                                )}
                            </p>
                        </div>

                        {/* Audio */}
                        <div>
                            {editingtrack ? (
                                <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                                    <label className="block text-black font-medium mb-2">
                                        Audio (mp3):
                                    </label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleAudioChange}
                                        className="w-full text-sm"
                                    />
                                    {previewAudio && (
                                        <div className="mt-4">
                                            <audio controls src={previewAudio} className="mt-2 w-full">
                                                Votre navigateur ne supporte pas l'élément audio.
                                            </audio>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <audio controls className="w-full">
                                    <source src={track.audio} type="audio/mpeg" />
                                    Votre navigateur ne supporte pas la lecture audio.
                                </audio>
                            )}
                        </div>
                        {/* Boutons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleEdittrack}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {editingtrack ? "Annuler" : "Modifier"}
                            </button>
                            {editingtrack && (
                                <button
                                    onClick={handleSaveTrack}
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Sauvegarder
                                </button>
                            )}
                        </div>

                        {/* Licences */}
                        <div className="pt-8">
                            <h2 className="text-2xl font-bold">Licences</h2>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {licenceTrack.map((licence, index) => (
                                    <div
                                        // Utilisation d'une clé unique : soit `id_licence_track`, soit une combinaison de l'index et d'un préfixe
                                        key={licence.id_licence_track || `new-licence-${index}`}
                                        className="p-4 border border-gray-300 rounded-lg"
                                    >
                                        {editinglicence ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={licence.type}
                                                    onChange={(e) =>
                                                        setLicenceTrack((prevLicences) =>
                                                            prevLicences.map((l, i) =>
                                                                i === index ? { ...l, type: e.target.value } : l
                                                            )
                                                        )
                                                    }
                                                    className="border p-2 rounded w-full"
                                                    placeholder="Type"
                                                />
                                                <input
                                                    type="text"
                                                    value={licence.prix}
                                                    onChange={(e) =>
                                                        setLicenceTrack((prevLicences) =>
                                                            prevLicences.map((l, i) =>
                                                                i === index ? { ...l, prix: e.target.value } : l
                                                            )
                                                        )
                                                    }
                                                    className="border p-2 rounded w-full mt-2"
                                                    placeholder="Prix (€)"
                                                />
                                            </div>
                                        ) : (
                                            <p>
                                                {licence.type} - {licence.prix} €
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {editinglicence && (
                                <div className="mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={postNewLicence}
                                    >
                                        Ajouter une licence
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Boutons */}
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={handleEditlicence}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {editinglicence ? "Annuler" : "Modifier"}
                            </button>
                            {editinglicence && (
                                <button
                                    onClick={handleSaveLicence}
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Sauvegarder
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Chargement...</p>
                )}
            </div>
        </>
    );

}
