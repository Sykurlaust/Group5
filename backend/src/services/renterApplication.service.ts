import { Timestamp } from "firebase-admin/firestore"
import { firestore } from "../config/firebase.js"
import type {
  CreateRenterApplicationData,
  RenterApplication,
} from "../models/renterApplication.model.js"

const renterApplicationsCollection = firestore.collection("renterApplications")

export const createRenterApplication = async (
  data: CreateRenterApplicationData,
): Promise<RenterApplication> => {
  const now = Timestamp.now()
  const docRef = renterApplicationsCollection.doc()

  const application: RenterApplication = {
    id: docRef.id,
    applicantUid: data.applicantUid,
    applicantEmail: data.applicantEmail,
    applicantDisplayName: data.applicantDisplayName,
    applicantPhone: data.applicantPhone,
    currentCity: data.currentCity,
    monthlyIncome: data.monthlyIncome,
    preferredMoveInDate: data.preferredMoveInDate,
    motivation: data.motivation,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  }

  await docRef.set(application)
  return application
}
