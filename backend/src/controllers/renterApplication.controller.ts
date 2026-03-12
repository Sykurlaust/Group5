import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import { createRenterApplication } from "../services/renterApplication.service.js"

export const submitRenterApplication = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const application = await createRenterApplication({
      applicantUid: req.user.uid,
      applicantEmail: req.user.email,
      applicantDisplayName: req.body.applicantDisplayName,
      applicantPhone: req.body.applicantPhone,
      currentCity: req.body.currentCity,
      monthlyIncome: req.body.monthlyIncome,
      preferredMoveInDate: req.body.preferredMoveInDate,
      motivation: req.body.motivation,
    })

    res.status(201).json({ application })
  } catch (error) {
    console.error("Submit renter application error:", error)
    res.status(500).json({ error: "Failed to submit renter application" })
  }
}
