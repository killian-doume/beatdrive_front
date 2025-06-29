"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState([
    { label: "Prods publiées", value: "..." },
    { label: "Beatmakers inscrits", value: "..." },
  ]);

  // Fonction pour récupérer le nombre de tracks
  const fetchTrackCount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des tracks");
      const tracks = await response.json();
      return tracks.length; // Compte le nombre total de tracks
    } catch (error) {
      console.error("Erreur lors de la récupération des tracks :", error);
      return 0;
    }
  };

  // Fonction pour récupérer le nombre de beatmakers (type !== "admin")
  const fetchBeatmakerCount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      const users = await response.json();
      return users.filter((user: { type: string }) => user.type !== "admin").length; // Filtre les admins
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      return 0;
    }
  };

  // Récupère les statistiques au chargement du composant
  useEffect(() => {
    const fetchStats = async () => {
      const trackCount = await fetchTrackCount();
      const beatmakerCount = await fetchBeatmakerCount();

      setStats([
        { label: "Prods publiées", value: trackCount.toString() },
        { label: "Beatmakers inscrits", value: beatmakerCount.toString() },
      ]);
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white">
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="flex flex-col gap-x-14 lg:flex-row lg:items-center">
                {/* Hero Text */}
                <div className="relative w-full lg:max-w-xl xl:max-w-2xl">
                  <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                    Découvrez et créez les meilleurs beats
                  </h1>
                  <p className="mt-8 text-lg text-gray-500 sm:max-w-md sm:text-xl lg:max-w-none">
                    Rejoignez notre communauté de beatmakers passionnés, publiez vos prods et collaborez avec les
                    meilleurs talents.
                  </p>
                </div>

                {/* Local Video Section */}
                <div className="relative mt-12 flex w-full justify-center lg:mt-0 lg:w-auto">
                  <video
                    src="/664E550F6B3ABB0D82CC35F86D9607AA_video_dashinit.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-lg shadow-lg "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Quelques chiffres</h2>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-3 lg:mx-0 lg:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-lg font-medium text-gray-600">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
