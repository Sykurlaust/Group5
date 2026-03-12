import { Timestamp } from "firebase-admin/firestore"

export interface CreateRenterApplicationData {
  applicantUid: string
  applicantEmail: string
  applicantDisplayName: string
  applicantPhone: string
  currentCity: string
  monthlyIncome: number
  preferredMoveInDate: string
  motivation: string
}

export interface RenterApplication {
  id: string
  applicantUid: string
  applicantEmail: string
  applicantDisplayName: string
  applicantPhone: string
  currentCity: string
  monthlyIncome: number
  preferredMoveInDate: string
  motivation: string
  status: "pending" | "approved" | "rejected"
  createdAt: Timestamp
  updatedAt: Timestamp
}
