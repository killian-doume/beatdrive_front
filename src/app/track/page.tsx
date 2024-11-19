'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeUp, faTimes, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Interface pour les pistes
interface Track {
    id_track: number;
    titre: string;
    cover: string;
    audio: string;
    genre: string;
    type: string;
    cle: string;
    price: number;
    user: {
        pseudo: string;
    };
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
            {/* Gauche : Infos du morceau */}
            <div className="flex items-center">
                <img src={track.cover} alt="Track cover" className="w-10 h-10 rounded-md" />
                <div className="ml-4 text-xs">
                    <p className="font-semibold">{track.titre}</p>
                    <p className="text-gray-400">{track.user.pseudo}</p>
                </div>
            </div>
            {/* Centre : Contrôles */}
            <div className="flex items-center">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-lg mx-2">
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                </button>
            </div>
            {/* Droite : Volume et Fermer */}
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
    const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
    const [filters, setFilters] = useState({ type: "", genre: "", cle: "" });
    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
    const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
    const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`);
                const data: Track[] = await response.json();

                setTracks(data);
                setFilteredTracks(data);

                // Extraire dynamiquement les valeurs uniques pour les filtres
                const types = Array.from(new Set(data.map((track) => track.type))).sort();
                const genres = Array.from(new Set(data.map((track) => track.genre))).sort();
                const keys = Array.from(new Set(data.map((track) => track.cle))).sort();

                setUniqueTypes(types);
                setUniqueGenres(genres);
                setUniqueKeys(keys);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchTracks();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);

        // Filtrer les pistes en fonction des filtres sélectionnés
        const filtered = tracks.filter((track) => {
            return (
                (updatedFilters.type === "" || track.type === updatedFilters.type) &&
                (updatedFilters.genre === "" || track.genre === updatedFilters.genre) &&
                (updatedFilters.cle === "" || track.cle === updatedFilters.cle)
            );
        });

        setFilteredTracks(filtered);
    };

    const handlePlayTrack = (track: Track) => {
        // Si une autre musique est déjà en cours, la couper avant de jouer la nouvelle
        if (activeTrack?.id_track !== track.id_track) {
            setActiveTrack(null); // Arrêter la lecture actuelle
            setTimeout(() => {
                setActiveTrack(track); // Démarrer la nouvelle musique après un court délai
            }, 100); // Petit délai pour éviter les conflits
        }
    };

    const handleAddToCart = (track: Track) => {
        // Récupérer le panier existant ou créer un nouveau tableau
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = [...existingCart, track];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(`"${track.titre}" a été ajouté au panier.`);
    };

    return (
        <>
            <Header />
            <div className="bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Titre et Filtres */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <h1 className="text-3xl font-bold text-black">Tous les morceaux</h1>
                        <div className="flex flex-row justify-between lg:justify-end gap-4 mt-4 lg:mt-0 w-full lg:w-auto">
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="p-2 border rounded-md text-black w-full sm:w-auto"
                            >
                                <option value="">Type</option>
                                {uniqueTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="genre"
                                value={filters.genre}
                                onChange={handleFilterChange}
                                className="p-2 border rounded-md text-black w-full sm:w-auto"
                            >
                                <option value="">Genre</option>
                                {uniqueGenres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="cle"
                                value={filters.cle}
                                onChange={handleFilterChange}
                                className="p-2 border rounded-md text-black w-full sm:w-auto"
                            >
                                <option value="">Clé</option>
                                {uniqueKeys.map((key) => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Grille de cartes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredTracks.map((track) => (
                            <div
                                key={track.id_track}
                                className="bg-black p-4 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 text-white"
                            >
                                <div className="relative w-full h-48 mb-4 group">
                                    <img
                                        src={track.cover}
                                        alt={track.titre}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    {/* Bouton Play affiché au survol */}
                                    <button
                                        onClick={() => handlePlayTrack(track)}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                    </button>
                                </div>
                                <a
                                    href={`/track/${track.id_track}`}
                                    className="text-lg font-semibold hover:underline"
                                >
                                    {track.titre}
                                </a>
                                <p className="text-gray-400 mb-4">{track.user.pseudo}</p>
                                <button
                                    onClick={() => handleAddToCart(track)}
                                    className="bg-blue-500 text-white w-full px-6 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    ${track.price ? track.price.toFixed(2) : "0.00"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audio Player en bas de l'écran */}
            {activeTrack && (
                <AudioPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />
            )}
        </>
    );
}
