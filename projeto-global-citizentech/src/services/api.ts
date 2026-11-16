
const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'https://climacidadao-java.onrender.com'

export interface Usuario {
  id: number
  nome: string
  email: string
}

async function requisitar<T>(caminho: string): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${API_URL}${caminho}`)
  } catch {
    throw new Error('Não foi possível conectar à API.')
  }

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar ${caminho}.`)
  }

  return (await resposta.json()) as T
}

export function getUsuarios(): Promise<Usuario[]> {
  return requisitar<Usuario[]>('/usuarios')
}
