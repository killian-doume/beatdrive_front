import Link from "next/link";

export default function GenreTrack() {
  // Genres statiques avec vos données
  const genres = [
    {
      id: 1,
      name: "Rap",
      image:
        "https://i.scdn.co/image/ab67706f000000025433afbc5f6fc1083d6645f2",
    },
    {
      id: 2,
      name: "Rock",
      image:
        "https://i.scdn.co/image/ab67706f00000002095de10bab2eeac5e434854a",
    },
    {
      id: 3,
      name: "Pop",
      image:
        "https://i.scdn.co/image/ab67706f00000002b99da04cd92019d599e01926",
    },
    {
      id: 4,
      name: "Reggae",
      image:
        "https://i.scdn.co/image/ab67706f00000002c61c26186a65f8c63104e913",
    },
    {
      id: 5,
      name: "Electro",
      image:
        "https://i.scdn.co/image/ab67706f00000002289ac8365eac54aed4608cf2",
    },
  ];

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Genre populaire</h1>
          <Link href="/track" className="text-black hover:underline font-medium">
            Voir plus
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <div className="w-full h-40 flex justify-center items-center mb-2 bg-gray-100 rounded-md">
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <Link
                href={{
                  pathname: "/track",
                  query: { genre: genre.name },
                }}
                className="text-lg font-semibold text-black text-center hover:underline"
              >
                {genre.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
