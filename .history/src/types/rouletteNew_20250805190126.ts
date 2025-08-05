// 🎯 TIPOS NUEVOS DESDE CERO - SIN CONTAMINACIÓN
// Versión minimalista para empezar limpio

export interface RouletteSectorNew {
  id: string
  displayName: string
  backgroundColor: string
  textColor: string
  isPrize: boolean
  probability: number // 0-100
  isActive: boolean
  order: number
  
  // Opcionales para después
  fontSize?: number
  fontFamily?: string
  textLines?: string[] // Múltiples líneas de texto
}

export interface RouletteAnimationNew {
  isSpinning: boolean
  currentAngle: number
  duration: number
  startTime?: number
}

export interface RouletteSpinResultNew {
  winnerSector: RouletteSectorNew
  finalAngle: number
  timestamp: Date
  participantInfo?: {
    name: string
    email: string
  }
}

export interface RouletteConfigNew {
  id: string
  name: string
  sectors: RouletteSectorNew[]
  createdAt: Date
  updatedAt: Date
}
