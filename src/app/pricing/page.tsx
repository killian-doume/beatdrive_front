'use client'

import Header from '@/components/header'
import { CheckIcon } from '@heroicons/react/20/solid'

const pricing = {
  tiers: [
    {
      name: 'Basic',
      id: 'tier-basic',
      href: '/track',
      price: 'à partir de €49.99',
      description: 'Licence MP3 pour usage personnel ou débutant.',
      features: ['MP3 uniquement', 'Achetez 2, obtenez 1 gratuit'],
      mostPopular: false,
    },
    {
      name: 'Standard',
      id: 'tier-standard',
      href: '/track',
      price: 'à partir de €249.99',
      description: 'Licence MP3 + WAV pour un usage intermédiaire.',
      features: ['MP3 et WAV inclus', 'Achetez 2, obtenez 2 gratuits'],
      mostPopular: false,
    },
    {
      name: 'Exclusive',
      id: 'tier-exclusive',
      href: '/track',
      price: 'Négocier le prix',
      description: 'Licence exclusive pour utilisation professionnelle.',
      features: ['MP3, STEMS et WAV inclus', 'Usage illimité'],
      mostPopular: true,
    },
  ],
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="bg-white">
      <Header />
      <div className=' py-8 '>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Licences de musique</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choisissez la licence qui vous convient
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-y-10 sm:mt-20 lg:grid-cols-3 lg:gap-x-8">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'ring-2 ring-indigo-600 rounded-lg bg-white shadow-lg'
                    : 'ring-1 ring-gray-200 rounded-lg bg-white shadow-sm',
                  'p-8'
                )}
              >
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                </p>
                <a
                  href={tier.href}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-gray-100 text-indigo-600 hover:bg-gray-200',
                    'mt-6 block w-full rounded-md py-2 text-center text-sm font-semibold'
                  )}
                >
                  {tier.name === 'Exclusive' ? 'Contactez-nous' : 'Acheter'}
                </a>
                <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
