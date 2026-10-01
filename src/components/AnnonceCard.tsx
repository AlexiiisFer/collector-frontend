import { ImageIcon } from 'lucide-react'

import type { Annonce, StatutAnnonce } from '@/api/annonces'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

const libellesStatut: Record<StatutAnnonce, string> = {
  EN_ATTENTE: 'En attente',
  PUBLIEE: 'Publiée',
  REFUSEE: 'Refusée',
  VENDUE: 'Vendue',
}

export function AnnonceCard({ annonce }: { annonce: Annonce }) {
  return (
    <Card className="overflow-hidden pt-0">
      {annonce.imageUrl ? (
        <img src={annonce.imageUrl} alt={annonce.titre} className="aspect-4/3 w-full object-cover" />
      ) : (
        <div className="flex aspect-4/3 items-center justify-center bg-muted text-muted-foreground">
          <ImageIcon className="size-10" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{annonce.titre}</CardTitle>
        <CardDescription className="line-clamp-2">{annonce.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-xl font-semibold">{euros.format(annonce.prix)}</p>
        <p className="text-sm text-muted-foreground">+ {euros.format(annonce.fraisPort)} de livraison</p>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">{libellesStatut[annonce.statut]}</Badge>
      </CardFooter>
    </Card>
  )
}
