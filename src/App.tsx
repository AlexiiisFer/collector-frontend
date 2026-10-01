import { useEffect, useState } from 'react'
import { AlertCircleIcon, PackageOpenIcon } from 'lucide-react'
import { toast } from 'sonner'

import { listerAnnonces, type Annonce } from '@/api/annonces'
import { AnnonceCard } from '@/components/AnnonceCard'
import { DeposerAnnonceDialog } from '@/components/DeposerAnnonceDialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  const [annonces, setAnnonces] = useState<Annonce[] | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    listerAnnonces()
      .then(setAnnonces)
      .catch(() => setErreur('Impossible de charger les annonces. Vérifiez que le serveur est démarré.'))
  }, [])

  function ajouterAnnonce(annonce: Annonce) {
    setAnnonces((precedentes) => [annonce, ...(precedentes ?? [])])
    toast.success(`Annonce « ${annonce.titre} » créée`, {
      description: 'Elle est en attente de validation.',
    })
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold tracking-tight">Collector</span>
          <DeposerAnnonceDialog onAnnonceCreee={ajouterAnnonce} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Annonces</h1>

        {erreur && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{erreur}</AlertDescription>
          </Alert>
        )}

        {!erreur && annonces === null && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        )}

        {annonces?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <PackageOpenIcon className="size-12" />
            <p>Aucune annonce pour le moment.</p>
          </div>
        )}

        {annonces && annonces.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {annonces.map((annonce) => (
              <AnnonceCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
        )}
      </main>

      <Toaster position="bottom-right" />
    </div>
  )
}
