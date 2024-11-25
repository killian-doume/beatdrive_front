"use client";
import Header from '@/components/header';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

interface CartItem {
  id_track: number;
  titre: string;
  cover: string;
  price: string;
  bpm: string;
  date: string;
}

export default function Panier() {
  const [products, setProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(cart);
        setProducts(parsedCart);
      } catch {
        setProducts([]);
      }
    }
  }, []);

  const handleRemoveItem = (id: number) => {
    // Supprime l'élément côté frontend
    const updatedProducts = products.filter((product) => product.id_track !== id);
    setProducts(updatedProducts);
    window.location.reload();

    // Supprime l'élément du localStorage
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
  };

  // Calcul du prix total
  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + parseFloat(product.price), 0).toFixed(2);
  };

  return (
    <div className="bg-white">
      <Header />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-14 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Votre panier
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
           

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product.id_track} className="flex py-6">
                    <div className="shrink-0">
                      <img
                        alt="Product image"
                        src={product.cover}
                        className="size-24 rounded-md object-cover sm:size-32"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-sm">
                            <a href="#" className="font-medium text-gray-700 hover:text-gray-800">
                              {product.titre}
                            </a>
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {product.price} €
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-1 items-end justify-between">
                        <p className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                          <span>Disponible</span>
                        </p>
                        <div className="ml-4">
                          <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => handleRemoveItem(product.id_track)}
                          >
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500">Votre panier est vide.</p>
              )}
            </ul>
          </section>

          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Produit-total</dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    {products.length} tracks
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Prix-total</dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    {calculateTotalPrice()} €
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Les frais de livraison seront calculés à la commande.
              </p>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Valider le panier
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                ou{' '}
                <a href="/track" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Continuer vos achats
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
