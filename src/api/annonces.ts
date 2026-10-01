// Toutes les communications avec l'API REST des annonces sont regroupées ici.
const API_URL = `${import.meta.env.VITE_API_URL}/api/annonces`

export type StatutAnnonce = 'EN_ATTENTE' | 'PUBLIEE' | 'REFUSEE' | 'VENDUE'

export interface Annonce {
  id: number
  titre: string
  description: string
  prix: number
  fraisPort: number
  imageUrl: string | null
  statut: StatutAnnonce
  dateCreation: string
}

export interface NouvelleAnnonce {
  titre: string
  description: string
  prix: number | null
  fraisPort: number | null
  imageUrl: string | null
}

/** Erreur renvoyée par l'API au format Problem Details, avec le détail éventuel des champs invalides. */
export class ApiError extends Error {
  readonly champs: Record<string, string>

  constructor(message: string, champs: Record<string, string> = {}) {
    super(message)
    this.champs = champs
  }
}

async function lireReponse<T>(response: Response): Promise<T> {
  const body = await response.json()
  if (!response.ok) {
    throw new ApiError(body.detail ?? `Erreur HTTP ${response.status}`, body.erreurs)
  }
  return body
}

export async function listerAnnonces(): Promise<Annonce[]> {
  return lireReponse(await fetch(API_URL))
}

export async function creerAnnonce(annonce: NouvelleAnnonce): Promise<Annonce> {
  return lireReponse(
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annonce),
    }),
  )
}
