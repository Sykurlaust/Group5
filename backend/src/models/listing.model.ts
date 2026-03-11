export interface Listing {
  id: string
  title: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  floor: string
  description: string
  image: string
  url: string
  phone: string
  type: string
  location: string
  municipality: string
  source: string
  availableFrom: string
  rentalPeriod: string
  deposit: string
  totalMoveInCost: string
  landlordName: string
  landlordImage: string
  landlordId: string
  clicks: number
}
