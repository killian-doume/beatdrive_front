"use client";

import Header from "@/components/header";
import { useEffect, useState } from "react";
interface User {
   
    adresse_facturation: string | null;
    adresse_livraison: string | null;
    avatar: string | null;
    email: string;
    id_user: number;
    nom: string;
    prenom: string;
    pseudo: string;
    telephone: string;
    type: string;
    username: string;
  }
export default function Mycompte() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser); 
            console.log(parsedUser);
            setIsAuthenticated(true);
          } catch {
            setIsAuthenticated(false);
          }
        }
    
      }, []);

    return (
        <div>
            <Header/>
        </div>
    );
}