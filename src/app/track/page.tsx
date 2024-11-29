'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeUp, faTimes, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

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
  createdAt: string; // Ajout pour trier par date
  user?: User; // Ajout pour inclure les informations utilisateur
}

interface User {
  id_user: number;
  pseudo: string;
}

interface LicenceTrack {
  id_licence_track: number;
  type: string;
  prix: string;
  track: {
    id_track: number;
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
      <div className="flex items-center">
        <img src={track.cover} alt="Track cover" className="w-10 h-10 rounded-md" />
        <div className="ml-4 text-xs">
          <p className="font-semibold">{track.titre}</p>
          <p className="text-gray-400">{track.user?.pseudo || "Auteur inconnu"}</p>
          <p className="text-gray-400">{track.genre}</p>
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
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [visibleTracks, setVisibleTracks] = useState<Track[]>([]);
  const [prices, setPrices] = useState<{ [id_track: number]: string }>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [filters, setFilters] = useState({ type: "", genre: "", cle: "" });
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`);
        const data: Track[] = await response.json();

        const tracksWithUsers = await Promise.all(
          data.map(async (track) => {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${track.id_user}`);
            const user: User = await userResponse.json();
            return { ...track, user };
          })
        );

        const sortedTracks = [...tracksWithUsers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTracks(sortedTracks);

        const genreQuery = searchParams.get("genre")?.toLowerCase() || "";
        const searchQuery = searchParams.get("search")?.toLowerCase() || "";

        const filtered = sortedTracks.filter((track) => {
          const matchesGenre = genreQuery === "" || track.genre.toLowerCase() === genreQuery;
          const matchesSearch =
            searchQuery === "" ||
            track.titre.toLowerCase().includes(searchQuery) ||
            track.user?.pseudo.toLowerCase().includes(searchQuery) ||
            track.genre.toLowerCase().includes(searchQuery);
          return matchesGenre && matchesSearch;
        });

        setFilteredTracks(filtered);
        setVisibleTracks(filtered.slice(0, 6));

        const types = Array.from(new Set(data.map((track) => track.type))).sort();
        const genres = Array.from(new Set(data.map((track) => track.genre))).sort();
        const keys = Array.from(new Set(data.map((track) => track.cle))).sort();

        setUniqueTypes(types);
        setUniqueGenres(genres);
        setUniqueKeys(keys);

        setFilters((prevFilters) => ({
          ...prevFilters,
          genre: genreQuery, 
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const fetchPrices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/licence_track`);
        const data: LicenceTrack[] = await response.json();
        const priceMapping: { [id_track: number]: string } = {};
        data.forEach((licence) => {
          if (licence.type === "Non-exclusive") {
            priceMapping[licence.track.id_track] = licence.prix;
          }
        });
        setPrices(priceMapping);
      } catch (error) {
        console.error("Erreur lors de la récupération des prix des licences :", error);
      }
    };

    fetchTracks();
    fetchPrices();
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const filtered = tracks.filter((track) => {
      return (
        (updatedFilters.type === "" || track.type === updatedFilters.type) &&
        (updatedFilters.genre === "" || track.genre === updatedFilters.genre) &&
        (updatedFilters.cle === "" || track.cle === updatedFilters.cle)
      );
    });

    setFilteredTracks(filtered);
    setVisibleTracks(filtered.slice(0, 6));
  };

  const handleShowMore = () => {
    const nextTracks = filteredTracks.slice(visibleTracks.length, visibleTracks.length + 6);
    setVisibleTracks([...visibleTracks, ...nextTracks]);
  };

  const handlePlayTrack = (track: Track) => {
    if (activeTrack?.id_track !== track.id_track) {
      setActiveTrack(null);
      setTimeout(() => {
        setActiveTrack(track);
      }, 100);
    }
  };

  const handleAddToCart = (track: Track, licenceType: string, licenceId: number) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const isAlreadyInCart = existingCart.some(
      (item: { id_track: number; licence: string }) =>
        item.id_track === track.id_track && item.licence === licenceType
    );

    if (isAlreadyInCart) {
      setNotification(`"${track.titre}" avec la licence "${licenceType}" est déjà dans votre panier.`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    const cartItem = {
      id_track: track.id_track,
      titre: track.titre,
      date: track.date,
      cover: track.cover,
      price: prices[track.id_track] || "0.00",
      licence: licenceType,
      id_licence_track: licenceId,
    };

    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setNotification(`"${track.titre}" avec la licence "${licenceType}" a été ajouté au panier.`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {notification && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-2 rounded shadow-lg">
              {notification}
            </div>
          )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTracks.map((track) => (
              <div
                key={track.id_track}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 text-white"
              >
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
                  href={`/track/${track.id_track}`}
                  className="text-lg text-black font-semibold hover:underline"
                >
                  {track.titre}
                </a>
                <p className="text-gray-400 mb-4">By : {track.user?.pseudo || "Auteur inconnu"}</p>
                <button
                  onClick={() => handleAddToCart(track, "Non-exclusive", 1)}
                  className="bg-indigo-600 text-white w-full px-6 py-2 rounded-md hover:bg-indigo-500 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  €{prices[track.id_track] || "0.00"}
                </button>
              </div>
            ))}
          </div>

          {visibleTracks.length < filteredTracks.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md "
              >
                Plus de tracks
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTrack && <AudioPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />}
    </>
  );
}
