'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Partenaire from '@/components/partenaire';
import Telechargement from '@/components/telechargement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

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
        <div className="container mx-auto flex items-center justify-between max-w-5xl">
          {/* Left Side: Text and Search Bar */}
          <div className="w-full md:w-1/2 flex flex-col items-start mr-8">
            <h2 className="text-white text-lg font-semibold mb-4">Votre premier hit commence ici</h2>
            <div className="flex items-center bg-gray-200 p-2 rounded-full shadow-md w-full">
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
          {/* Right Side: Carousel of Covers */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 ml-8">
            {covers.length > 0 && (
              <div className="carousel">
                <div className="relative">
                  <img
                    src={covers[currentCoverIndex].cover}
                    alt={`Cover ${currentCoverIndex + 1}`}
                    className="rounded-md border border-gray-300 shadow-md max-w-2xl transition-opacity duration-1000 ease-in-out cursor-pointer"
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
                  {/* Overlay with Play Button on Hover */}
                  {hoveredTrack === covers[currentCoverIndex] && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white rounded-md pointer-events-none"
                    >
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

      <Partenaire />
      <Telechargement />

      {/* Audio Player at the bottom */}
      {activeTrack && (
        <AudioPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />
      )}
    </>
  );
}
