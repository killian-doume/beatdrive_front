"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/header';

export default function UploadTrack() {
  const [titre, setTitre] = useState<string>(''); // Titre
  const [date, setDate] = useState<string>(''); // Date
  const [bpm, setBpm] = useState<string>(''); // BPM
  const [description, setDescription] = useState<string>(''); // Description
  const [cle, setCle] = useState<string>(''); // Clé musicale
  const [genre, setGenre] = useState<string>(''); // Genre
  const [type, setType] = useState<string>(''); // Type
  const [audio, setAudio] = useState<string>(''); // Audio
  const [status, setStatus] = useState<string>(''); // Status
  const [cover, setCover] = useState<File | null>(null); // Fichier image
  const [userId, setUserId] = useState<string>(''); // ID utilisateur
  const [previewCover, setPreviewCover] = useState<string | null>(null); // Aperçu de l'image

  // Récupérer l'id_user depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id_user) {
          setUserId(parsedUser.id_user); // Définit l'id_user depuis localStorage
        }
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur depuis localStorage :", error);
      }
    }
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!titre || !date || !bpm || !description || !cle || !genre || !type || !audio || !cover || !userId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const formData = new FormData();

      // Ajouter l'objet track en tant que chaîne JSON
      const trackData = {
        titre,
        date,
        bpm,
        description,
        cle,
        genre,
        type,
        audio,
        status,
        user: { id_user: userId }, // Inclure l'id_user
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


  function handleAudioChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Upload d'une Track</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-black"
          encType="multipart/form-data"
        >
          {/* Section de gauche : Inputs */}
          <div className="space-y-4">
            {/* Titre */}
            <div>
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
            <div>
              <label className="block text-black font-medium mb-2">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* BPM */}
            <div>
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

            {/* Genre */}
            <div>
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
            <div>
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

            {/* Clé musicale */}
            <div>
              <label className="block text-black font-medium mb-2">Clé musicale:</label>
              <select
                value={cle}
                onChange={(e) => setCle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
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
            </div>

            {/* Statut */}
            <div>
              <label className="block text-black font-medium mb-2">Statut:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="Non disponible">Non disponible</option>
              </select>
            </div>
            {/* Description */}
            <div>
              <label className="block text-black font-medium mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
          </div>

          {/* Section de droite : Upload */}
          <div className="space-y-6">
            {/* Cover Upload */}
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-black font-medium mb-2">Cover (jpg):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="w-full text-sm"
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

            {/* Audio Upload */}
           {/* Cover Upload */}
           <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-black font-medium mb-2">Audio (mp3)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="w-full text-sm"
                required
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

            {/* Bouton Envoyer */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
