'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Partenaire from '@/components/partenaire';
import Telechargement from '@/components/telechargement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Tendance_track from '@/components/tendance_track';
import GenreTrack from '@/components/genre_track';

interface Track {
  cover: string;
  audio: string;
  title: string;
  artist: string;
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
    };
  }, [isPlaying, audioRef, volume]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 flex items-center justify-between shadow-lg">
      {/* Left: Track Cover, Shopping Bag Icon, and Info */}
      <div className="flex items-center">
        <img src={track.cover} alt="Track cover" className="w-10 h-10 rounded-md" />
        <button className="p-2 focus:outline-none" onClick={() => alert('Ajouter au panier')}>
          <ShoppingBagIcon className="w-6 h-6 text-white" />
        </button>
        <div className="ml-2 text-sm">
          <p className="font-semibold">{track.title}</p>
          <p className="text-xs text-gray-400">{track.artist}</p>
        </div>
      </div>
      {/* Center: Playback Controls */}
      <div className="flex items-center">
        <button onClick={() => setIsPlaying(!isPlaying)} className="text-xl mr-2">
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
      </div>
      {/* Right: Volume Control and Close Button */}
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
          <FontAwesomeIcon icon={faTimes} /> {/* Close Icon */}
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [covers, setCovers] = useState<Track[]>([]);
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`);
        const data: Track[] = await response.json();
        const latestCovers = data.slice(-3).map((track) => ({
          cover: track.cover,
          audio: track.audio,
          title: track.title,
          artist: track.artist,
        }));
        setCovers(latestCovers);
      } catch (error) {
        console.error('Erreur lors de la récupération des pistes:', error);
      }
    };
    fetchTracks();
  }, []);

  useEffect(() => {
    if (covers.length > 0 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentCoverIndex((prevIndex) => (prevIndex + 1) % covers.length);
      }, 10000); // Change every 10 seconds

      return () => clearInterval(interval);
    }
  }, [covers, isHovered]);

  const handlePlayTrack = (track: Track) => {
    setActiveTrack(track);
  };

  return (
    <>
      <Header />
      <div className="bg-black py-8">
  <div className="container mx-auto flex flex-col items-center justify-center lg:flex-row lg:justify-between max-w-5xl">
    {/* Texte centré en mode mobile et aligné à gauche en lg */}
    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mb-6 lg:mb-0">
      <h2 className="text-white text-lg font-semibold text-center lg:text-left">
        Votre premier hit commence ici
      </h2>
      {/* Barre de recherche centrée en mode mobile et alignée comme en lg */}
      <div className="flex items-center bg-gray-200 p-2 rounded-full shadow-md w-11/12 sm:w-2/3 lg:w-full mt-4 lg:mt-0">
        <input
          type="text"
          placeholder="Recherchez votre hit..."
          className="bg-transparent outline-none flex-grow px-2 text-gray-700"
        />
        <button className="bg-blue-600 p-2 rounded-full">
          <FontAwesomeIcon icon={faSearch} className="text-white" /> {/* Search Icon */}
        </button>
      </div>
    </div>

    {/* Cover centrée en mode mobile et alignée comme en lg */}
    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
      {covers.length > 0 && (
        <div className="carousel">
          <div className="relative">
            <img
              src={covers[currentCoverIndex].cover}
              alt={`Cover ${currentCoverIndex + 1}`}
              className="w-full max-w-sm h-auto max-h-72 rounded-md border border-gray-300 shadow-md transition-opacity duration-1000 ease-in-out cursor-pointer object-contain"
              onClick={() => handlePlayTrack(covers[currentCoverIndex])}
              onMouseEnter={() => {
                setHoveredTrack(covers[currentCoverIndex]);
                setIsHovered(true); // Stop the carousel
              }}
              onMouseLeave={() => {
                setHoveredTrack(null);
                setIsHovered(false); // Resume the carousel
              }}
            />
            {/* Overlay avec bouton Play sur Hover */}
            {hoveredTrack === covers[currentCoverIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white rounded-md pointer-events-none">
                <button
                  onClick={() => handlePlayTrack(hoveredTrack)}
                  className="text-4xl cursor-pointer pointer-events-auto"
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
</div>

      <Tendance_track />
      <GenreTrack />
      <Partenaire />
      <Telechargement />

      {/* Audio Player at the bottom */}
      {activeTrack && (
        <AudioPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />
      )}
    </>
  );
}
