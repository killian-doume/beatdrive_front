'use client';

import { useState } from 'react';
import Header from '@/components/header';

export default function UploadTrack() {
  const [titre, setTitre] = useState<string>(''); // Titre
  const [date, setDate] = useState<string>(''); // Date
  const [bpm, setBpm] = useState<string>(''); // BPM
  const [description, setDescription] = useState<string>(''); // Description
  const [cle, setCle] = useState<string>(''); // Clé musicale
  const [genre, setGenre] = useState<string>(''); // Genre
  const [type, setType] = useState<string>(''); // Type
  const [audio, setAudio] = useState<string>(''); // Type
  const [status, setStatus] = useState<string>('draft'); // Status
  const [cover, setCover] = useState<File | null>(null); // Fichier image
  const [userId, setUserId] = useState<string>(''); // ID utilisateur
  const [previewCover, setPreviewCover] = useState<string | null>(null); // Aperçu de l'image

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (!titre || !cover || !userId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Ajouter l'objet track en tant que chaîne JSON
      const trackData = {
        titre,
        bpm,
        description,
        cle,
        genre,
        type,
        audio,
        status,
        user: { id_user: userId },
      };
      formData.append("track", JSON.stringify(trackData));
  
      // Ajouter l'image cover
      formData.append("src", cover);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`, {
        method: "POST",
       
        credentials: "include",
        body: formData, // Ne pas inclure de Content-Type, fetch le gère automatiquement pour le multipart/form-data
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Track créé avec succès :", result);
        alert("Track créé avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la création du track :", errorData);
        alert(`Erreur : ${errorData.message || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur s'est produite lors de la requête.");
    }
  };
  

  return (
    <>
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Uploader une Track</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
          encType="multipart/form-data"
        >
          {/* Titre */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Titre:</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Entrez le titre de la track"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* BPM */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">BPM:</label>
            <input
              type="text"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="Entrez le BPM"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez une description"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Clé musicale */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Clé musicale:</label>
            <input
              type="text"
              value={cle}
              onChange={(e) => setCle(e.target.value)}
              placeholder="Entrez la clé musicale"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Genre */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Genre:</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Entrez le genre"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Entrez le type"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Audio */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">URL de l'audio:</label>
            <input
              type="text"
              value={audio}
              onChange={(e) => setAudio(e.target.value)}
              placeholder="Entrez l'URL de l'audio"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          {/* Cover */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Cover (Image):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full"
              required
            />
            {previewCover && (
              <div className="mt-4">
                <p className="text-black">Aperçu de l'image :</p>
                <img
                  src={previewCover}
                  alt="Preview"
                  className="mt-2 max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>

          {/* User ID */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">Utilisateur (ID):</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Entrez l'ID de l'utilisateur"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}
