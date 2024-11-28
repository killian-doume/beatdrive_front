// components/PageError.tsx (remarquez que le nom est maintenant PascalCase pour un composant)
export default function PageError({ message }: { message?: string }) {
    return (
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Accès interdit
          </h1>
          <p className="mt-6 text-lg font-medium text-gray-500">
            {message || "Vous n'avez pas l'autorisation d'accéder à cette page."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Retour à l'accueil
            </a>
            <a
              href="/login"
              className="text-sm font-semibold text-gray-900"
            >
              Aller à la connexion <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    );
  }
  