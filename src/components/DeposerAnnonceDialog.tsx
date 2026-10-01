import { useState, type FormEvent } from 'react'
import { PlusIcon } from 'lucide-react'

import { ApiError, creerAnnonce, type Annonce } from '@/api/annonces'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function ErreurChamp({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function DeposerAnnonceDialog({ onAnnonceCreee }: { onAnnonceCreee: (annonce: Annonce) => void }) {
  const [ouvert, setOuvert] = useState(false)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [erreurs, setErreurs] = useState<Record<string, string>>({})

  function changerOuverture(valeur: boolean) {
    setOuvert(valeur)
    setErreurs({})
  }

  async function soumettre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const donnees = new FormData(event.currentTarget)
    const nombre = (champ: string) => (donnees.get(champ) === '' ? null : Number(donnees.get(champ)))

    setEnvoiEnCours(true)
    try {
      const annonce = await creerAnnonce({
        titre: String(donnees.get('titre')),
        description: String(donnees.get('description')),
        prix: nombre('prix'),
        fraisPort: nombre('fraisPort'),
        imageUrl: String(donnees.get('imageUrl')) || null,
      })
      changerOuverture(false)
      onAnnonceCreee(annonce)
    } catch (erreur) {
      // Une erreur autre qu'ApiError signifie que le serveur est injoignable
      setErreurs(
        erreur instanceof ApiError
          ? { ...erreur.champs, formulaire: erreur.message }
          : { formulaire: 'Impossible de joindre le serveur' },
      )
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <Dialog open={ouvert} onOpenChange={changerOuverture}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Déposer une annonce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={soumettre} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Déposer une annonce</DialogTitle>
            <DialogDescription>Votre annonce sera visible après validation par la modération.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="titre">Titre</Label>
            <Input id="titre" name="titre" maxLength={100} placeholder="Figurine Star Wars vintage" required />
            <ErreurChamp message={erreurs.titre} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" maxLength={2000} rows={4} required />
            <ErreurChamp message={erreurs.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input id="prix" name="prix" type="number" min="0.01" step="0.01" required />
              <ErreurChamp message={erreurs.prix} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fraisPort">Frais de port (€)</Label>
              <Input id="fraisPort" name="fraisPort" type="number" min="0" step="0.01" required />
              <ErreurChamp message={erreurs.fraisPort} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
            <ErreurChamp message={erreurs.imageUrl} />
          </div>

          <ErreurChamp message={erreurs.formulaire} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={envoiEnCours}>
              {envoiEnCours ? 'Publication...' : 'Publier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
