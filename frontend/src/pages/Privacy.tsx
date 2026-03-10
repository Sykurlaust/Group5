import LegalCard from "../components/LegalCard"
import PageLayout from "../components/PageLayout"

function Privacy() {
  return (
    <PageLayout>
      <LegalCard label="Privacy Policy" title="Group 5 Privacy Policy">
        <p>
          This app uses Google and Facebook login for authentication. We only collect the
          profile information provided by the selected login provider that is necessary to sign
          users in and operate the app.
        </p>
        <p>
          We do not sell personal data. Information is used only for account access, basic user
          identification, and improving the experience inside this project.
        </p>
        <p>
          We retain personal data only as long as required to provide services. Users can
          request deletion via the Data Deletion page or contact us directly at
          <span className="font-semibold"> info@gcrenting.com</span>.
        </p>
        <p>
          For more details on cookies, third‑party services, or data rights please refer to
          [insert full policy here]. This text is representative; legal teams typically
          provide the full version.
        </p>
      </LegalCard>
    </PageLayout>
  )
}

export default Privacy
