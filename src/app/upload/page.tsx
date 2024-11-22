'use client'

import Header from '@/components/header'
import { useState } from 'react'

interface User {
  nom: string
  prenom: string
  email: string
  username: string
  telephone: string
  pseudo: string
  adresse_facturation: string | null
  adresse_livraison: string | null
  avatar: string | null
  type: string
  id_user: number
}

interface Track {
  id_track: number
  titre: string
  author: string
  cover: string
  price: string
  bpm: string
  cle: string
  date: string
  description: string
  genre: string
  statut: string
  type: string
  audio: string
}

export default function Upload() {





 
  return (
    <>
      <Header />
     
    </>
  )
}
