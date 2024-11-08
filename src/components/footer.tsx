import Link from 'next/link'

const navigation = {
  main: [
    { name: 'Track', href: '/track' },
    { name: 'A propos', href: '/about' },
    { name: 'CGV', href: '/cgv' },
    { name: 'CGU', href: '/cgu' },
    { name: 'Mon compte', href: '/mon-compte' },
  ],
  social: [
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* Icone Instagram */}
          <path fillRule="evenodd" d="M12.315 2c2.43..." clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'X',
      href: 'https://x.com',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* Icone X */}
          <path d="M13.6823 10.6218L20.2391 3H18.6854..." />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* Icone GitHub */}
          <path fillRule="evenodd" d="M12 2C6.477..." clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          {/* Icone YouTube */}
          <path fillRule="evenodd" d="M19.812 5.418c..." clipRule="evenodd" />
        </svg>
      ),
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        
        {/* Navigation principale */}
        <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Liens sociaux */}
        <div className="mt-16 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-10 text-center text-sm/6 text-gray-600">&copy; 2024 Beat Drive, Inc. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
