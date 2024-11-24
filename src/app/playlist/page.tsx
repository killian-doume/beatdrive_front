'use client'

import Header from '@/components/header'
import { useState, useEffect, ChangeEvent } from 'react'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface User {
  nom: string
  prenom: string
  email: string
  username: string
  telephone: string
  pseudo: string
  adresse_facturation: string | null
  adresse_livraison: string | null
  avatar: string | null
  type: string
  id_user: number
}

interface Track {
  id_track: number
  titre: string
  author: string
  cover: string
  price: string
  bpm: string
  cle: string
  date: string
  description: string
  genre: string
  statut: string
  type: string
  audio: string
}

export default function Playlist() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true)
  const [user, setUser] = useState<User>({
    nom: '',
    prenom: '',
    email: '',
    username: '',
    telephone: '',
    pseudo: '',
    adresse_facturation: '',
    adresse_livraison: '',
    avatar: null,
    type: '',
    id_user: 0,
  })
  const [tracks, setTracks] = useState<Track[]>([])
  const [editableTrackId, setEditableTrackId] = useState<number | null>(null)
  const [editableTrack, setEditableTrack] = useState<Partial<Track>>({})
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        nom: parsedUser.nom || '',
        prenom: parsedUser.prenom || '',
        email: parsedUser.email || '',
        username: parsedUser.username || '',
        telephone: parsedUser.telephone || '',
        pseudo: parsedUser.pseudo || '',
        adresse_facturation: parsedUser.adresse_facturation || '',
        adresse_livraison: parsedUser.adresse_livraison || '',
        avatar: parsedUser.avatar || null,
        type: parsedUser.type || '',
        id_user: parsedUser.id_user || 0,
      })
      fetchTracks(parsedUser.id_user)
    } else {
      setIsAuthorized(false)
    }
  }, [])

  const fetchTracks = async (id_user: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track/all/${id_user}`)
      const data = await response.json()
      console.log('Tracks fetched:', data)
      setTracks(data)
    } catch (error) {
      console.error('Error fetching tracks:', error)
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAudioFile(file)

      // Option 1: Generate temporary URL
      const temporaryUrl = URL.createObjectURL(file)
      setAudioUrl(temporaryUrl)
      console.log('Temporary audio URL:', temporaryUrl)

      // Option 2: Upload file to server or cloud storage
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/audio`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setAudioUrl(data.url) // Use the URL from server
          console.log('Uploaded audio URL:', data.url)
        } else {
          console.error('Failed to upload audio file')
        }
      } catch (error) {
        console.error('Error uploading audio file:', error)
      }
    }
  }

  const handleEdit = (track: Track) => {
    setEditableTrackId(track.id_track)
    setEditableTrack({ ...track })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableTrack((prev) => ({
      ...prev,
      [name]: value, // Met à jour dynamiquement le champ modifié
    }));
  };


  const handleCancel = () => {
    setEditableTrackId(null); // Réinitialise l'ID en édition
    setEditableTrack({}); // Réinitialise les données modifiables
  };

  const handleSave = async (id_track: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track/${id_track}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableTrack),
      })
      if (response.ok) {
        const updatedTrack = await response.json()
        setTracks((prevTracks) =>
          prevTracks.map((track) =>
            track.id_track === id_track ? updatedTrack : track
          )
        )
        console.log('Track updated:', updatedTrack)
        setEditableTrackId(null)
      } else {
        console.error('Failed to update track')
      }
    } catch (error) {
      console.error('Error updating track:', error)
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>, key: string): void {
    throw new Error('Function not implemented.')
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-6 text-black">Playlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {tracks.map((track) => (
    <div
      key={track.id_track}
      className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image de couverture */}
      <div className="relative">
        <img
          src={track.cover}
          alt={track.titre}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-75">
          {track.genre}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Contenu de la carte */}
        {Object.keys(track)
          .filter(
            (key) =>
              !["user", "id_track", "Link", "ThumbnailLink", "link", "thumbnailLink"].includes(key)
          )
          .map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700 capitalize">
                {key}:
              </label>
              {editableTrackId === track.id_track ? (
                key === "cover" || key === "audio" ? (
                  // Input file pour cover et audio
                  <input
                    type="file"
                    name={key}
                    onChange={(e) => handleFileChange(e, key)}
                    className="border border-gray-300 bg-gray-50 text-sm text-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : key === "cle" ? (
                  // Liste déroulante pour cle
                  <select
                    name={key}
                    value={editableTrack[key as keyof Track] || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 bg-gray-50 text-sm text-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Sélectionnez une clé</option>
                    {[
                      "C Major",
                      "A Minor",
                      "G Major",
                      "E Minor",
                      "D Major",
                      "B Minor",
                      "A Major",
                      "F# Minor",
                      "E Major",
                      "C# Minor",
                      "B Major",
                      "G# Minor",
                      "F Major",
                      "D Minor",
                    ].map((cle) => (
                      <option key={cle} value={cle}>
                        {cle}
                      </option>
                    ))}
                  </select>
                ) : key === "statut" ? (
                  // Liste déroulante pour statut
                  <select
                    name={key}
                    value={editableTrack[key as keyof Track] || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 bg-gray-50 text-sm text-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Non disponible">Non disponible</option>
                  </select>
                ) : (
                  // Input texte pour les autres champs
                  <input
                    type="text"
                    name={key}
                    value={editableTrack[key as keyof Track] || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 bg-gray-50 text-sm text-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )
              ) : (
                // Affichage en mode lecture seule
                <span className="text-sm text-gray-600">
                  {track[key as keyof Track]}
                </span>
              )}
            </div>
          ))}
      </div>

      {/* Boutons */}
      <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
        {editableTrackId === track.id_track ? (
          <>
            <button
              className="flex-1 bg-green-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors text-sm"
              onClick={() => handleSave(track.id_track)}
            >
              <CheckIcon className="w-4 h-4 mr-1" /> Valider
            </button>
            <button
              className="flex-1 bg-gray-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-gray-600 transition-colors text-sm"
              onClick={handleCancel}
            >
              <XMarkIcon className="w-4 h-4 mr-1" /> Annuler
            </button>
          </>
        ) : (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors text-sm"
            onClick={() => handleEdit(track)}
          >
            <PencilSquareIcon className="w-4 h-4 mr-1" /> Modifier
          </button>
        )}
      </div>
    </div>
  ))}
</div>





      </div>
    </>
  )
}
