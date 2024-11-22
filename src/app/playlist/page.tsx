'use client'

import Header from '@/components/header'
import { useState, useEffect } from 'react'
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/solid'

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTrack({
      ...editableTrack,
      [e.target.name]: e.target.value,
    })
  }

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

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-6">Playlist</h1>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Upload Audio:</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="border rounded p-2"
          />
          {audioUrl && (
            <p className="text-sm text-green-500 mt-2">Audio URL: {audioUrl}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id_track}
              className="flex flex-col border p-4 rounded-md shadow-md"
            >
              <img
                src={track.cover}
                alt={track.titre}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              {editableTrackId === track.id_track ? (
                <>
                  {Object.keys(track)
                    .filter((key) => key !== 'user' && key !== 'id_track') // Exclure 'user' et 'id_track'
                    .map((key) => (
                      <div key={key} className="mb-2">
                        <label className="block text-sm font-bold text-black">
                          {key}:
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={(editableTrack as any)[key] || ''}
                          onChange={handleInputChange}
                          className="border rounded p-2 text-black w-full"
                        />
                      </div>
                    ))}
                  <button
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center"
                    onClick={() => handleSave(track.id_track)}
                  >
                    <CheckIcon className="w-5 h-5 mr-2" /> Valider
                  </button>
                </>
              ) : (
                <>
                  {Object.entries(track)
                    .filter(([key]) => key !== 'user' && key !== 'id_track') // Exclure 'user' et 'id_track'
                    .map(([key, value]) => (
                      <p key={key} className="text-sm text-black">
                        <strong>{key}:</strong>{' '}
                        {typeof value === 'object' && value !== null
                          ? JSON.stringify(value)
                          : value}
                      </p>
                    ))}
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
                    onClick={() => handleEdit(track)}
                  >
                    <PencilSquareIcon className="w-5 h-5 mr-2" /> Modifier
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
