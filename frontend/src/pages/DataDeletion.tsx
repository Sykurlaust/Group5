import LegalCard from "../components/LegalCard"
import PageLayout from "../components/PageLayout"

function DataDeletion() {
  return (
    <PageLayout>
      <LegalCard label="Data Deletion" title="Request Data Deletion">
        <p>
          If you would like your account data removed from this project, email
          <span className="font-semibold"> info@gcrenting.com</span> with the subject line
          <span className="font-semibold"> Data Deletion Request</span>.
        </p>
        <p>
          Once we verify the request, we will delete the related account information associated with
          your login from this project within a reasonable time.
        </p>
        <p>
          This page exists to provide a clear public deletion process for users who sign in through
          third-party authentication providers.
        </p>
      </LegalCard>
    </PageLayout>
  )
}

export default DataDeletion
