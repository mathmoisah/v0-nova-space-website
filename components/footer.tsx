"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
              <span className="font-bold text-lg" style={{ color: "#00D4FF" }}>
                NovaSpace
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plateforme créative pour partager, créer et se connecter.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/feed" className="hover:text-foreground transition">
                  Découvrir
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">© 2025 NovaSpace. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
