export default function GenreTrack() {
    // Genres statiques avec vos données
    const genres = [
      {
        id: 1,
        name: "rap",
        image:
          "https://img.freepik.com/vecteurs-premium/silhouette-du-raphop-gens-dans-graffiti-tag-hip-hop-art-rue-illustration-typographie_894890-1154.jpg",
      },
      {
        id: 2,
        name: "rock",
        image:
          "https://img.freepik.com/vecteurs-libre/concept-geste-rock-monochrome-vintage_225004-1211.jpg?t=st=1731928476~exp=1731932076~hmac=2c8475d3e8e2848d6835365aeadafa46d855eb6e7445f71b3b3dc522c8a6afe5&w=360",
      },
      {
        id: 3,
        name: "pop",
        image:
          "https://www.shutterstock.com/shutterstock/photos/515538502/display_1500/stock-vector-pop-music-text-art-colorful-calligraphy-happy-illustration-funny-notes-and-vynil-music-sound-515538502.jpg",
      },
      {
        id: 4,
        name: "reggae",
        image:
          "https://www.shutterstock.com/shutterstock/photos/627314249/display_1500/stock-vector-vector-illustration-on-the-theme-of-reggae-music-slogan-just-relax-and-feel-reggae-grunge-627314249.jpg",
      },
      {
        id: 5,
        name: "electro",
        image:
          "https://www.shutterstock.com/shutterstock/photos/2045122157/display_1500/stock-vector-illustration-of-dj-electro-music-2045122157.jpg",
      },
    ];
  
    return (
      <div className="bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-black">Genre populaire</h1>
            <a href="/track" className="text-purple-600 hover:underline font-medium">
              Voir plus
            </a>
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
                <h2 className="text-lg font-semibold text-black text-center">{genre.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  