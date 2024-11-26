"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function UploadTrack() {
  const [titre, setTitre] = useState<string>(""); // Titre
  const [date, setDate] = useState<string>(""); // Date
  const [bpm, setBpm] = useState<string>(""); // BPM
  const [description, setDescription] = useState<string>(""); // Description
  const [cle, setCle] = useState<string>(""); // Clé musicale
  const [genre, setGenre] = useState<string>(""); // Genre
  const [type, setType] = useState<string>(""); // Type
  const [status, setStatus] = useState<string>("Disponible"); // Statut
  const [cover, setCover] = useState<File | null>(null); // Fichier image
  const [audioFile, setAudioFile] = useState<File | null>(null); // Fichier audio
  const [userId, setUserId] = useState<string>(""); // ID utilisateur
  const [previewCover, setPreviewCover] = useState<string | null>(null); // Aperçu de l'image
  const [previewAudio, setPreviewAudio] = useState<string | null>(null); // Aperçu de l'audio
  const [showCreationModal, setShowCreationModal] = useState<boolean>(false);
  const router = useRouter(); // Initialisation du routeur
  // Récupérer l'id_user depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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

  // Nettoyage des URLs temporaires pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (previewCover) URL.revokeObjectURL(previewCover);
      if (previewAudio) URL.revokeObjectURL(previewAudio);
    };
  }, [previewCover, previewAudio]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Vérifiez que tous les champs obligatoires sont remplis
    if (!titre || !bpm || !description || !cle || !genre || !type || !audioFile || !cover || !userId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Obtenez la date d'aujourd'hui au format ISO (par exemple, "2024-11-25T12:34:56.789Z")
    const today = new Date().toISOString();

    // Préparation des données track
    const trackData = {
      titre,
      date: today, // Utilisation de la date actuelle
      bpm,
      description,
      cle,
      genre,
      type,
      statut: status,
      id_user: userId,
    };

    // Création de l'objet FormData
    const formData = new FormData();
    formData.append("track", JSON.stringify(trackData)); // Ajout des données track sous forme de JSON
    formData.append("src", cover); // Ajout du fichier cover
    formData.append("audio", audioFile); // Ajout du fichier audio

    try {
      // Envoi de la requête vers l'API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      console.log("Données envoyées :", JSON.stringify(trackData));

      if (response.ok) {
        // Traitez la réponse si la requête a réussi
        const result = await response.json();
        console.log("Track créé avec succès :", result);
        // Afficher le modal de confirmation
        setShowCreationModal(true);

      } else {
        // Affichez un message d'erreur si la requête échoue
        const errorData = await response.text();
        console.error("Erreur lors de la création du track :", errorData);
        alert("Erreur lors de la création du track.");
      }
    } catch (error) {
      // Gestion des erreurs réseau ou autres
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur s'est produite lors de la requête.");
    }
  };


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
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
              <label className="block text-black font-medium mb-2">Audio (mp3):</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="w-full text-sm"
                required
              />
              {previewAudio && (
                <div className="mt-4">
                  <p className="text-black">Aperçu de l'audio :</p>
                  <audio controls src={previewAudio} className="mt-2 w-full">
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Envoyer
            </button>
          </div>
        </form>
        {showCreationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Création réussie</h2>
          <p className="text-gray-600 mb-6">
            La piste <strong>{titre}</strong> a été créée avec succès !
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              setShowCreationModal(false);
              router.push("/playlist"); // Redirection vers /playlist
            }}
          >
            OK
          </button>
        </div>
      </div>
    )}
      </div>
    </>
  );
}
