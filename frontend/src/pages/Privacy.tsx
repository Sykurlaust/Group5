import LegalCard from "../components/LegalCard"
import PageLayout from "../components/PageLayout"

const summaryItems = [
  {
    question: "What personal information do we process?",
    answer:
      "When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.",
    href: "#personal-info",
  },
  {
    question: "Do we process any sensitive personal information?",
    answer:
      "Some information may be considered special or sensitive (for example racial or ethnic origins, sexual orientation, or religious beliefs). We process such information only with your consent or as permitted by law.",
    href: "#sensitive-info",
  },
  {
    question: "Do we collect any information from third parties?",
    answer:
      "We may collect information from public databases, marketing partners, social media platforms, and other outside sources to enhance our records and services.",
    href: "#other-sources",
  },
  {
    question: "How do we process your information?",
    answer:
      "We process your data to provide, improve, and administer our Services, communicate with you, ensure security and fraud prevention, comply with law, and perform other tasks with your consent.",
    href: "#info-use",
  },
  {
    question: "When and with whom do we share personal information?",
    answer:
      "We share data only in specific situations—for example with affiliates, business partners, or during business transfers—when it is necessary for the stated purpose.",
    href: "#share",
  },
  {
    question: "How do we keep your information safe?",
    answer:
      "We employ organisational and technical safeguards, but no electronic transmission can be guaranteed to be 100% secure.",
    href: "#info-safe",
  },
  {
    question: "What are your rights?",
    answer:
      "Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information.",
    href: "#privacy-rights",
  },
  {
    question: "How do you exercise your rights?",
    answer:
      "Submit a data subject access request or contact us directly. We will respond in accordance with applicable data protection laws.",
    href: "#request",
  },
]

const tableOfContents = [
  { id: "infocollect", label: "1. WHAT INFORMATION DO WE COLLECT?" },
  { id: "info-use", label: "2. HOW DO WE PROCESS YOUR INFORMATION?" },
  { id: "share", label: "3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?" },
  { id: "cookies", label: "4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?" },
  { id: "social-logins", label: "5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?" },
  { id: "info-retain", label: "6. HOW LONG DO WE KEEP YOUR INFORMATION?" },
  { id: "info-safe", label: "7. HOW DO WE KEEP YOUR INFORMATION SAFE?" },
  { id: "minors", label: "8. DO WE COLLECT INFORMATION FROM MINORS?" },
  { id: "privacy-rights", label: "9. WHAT ARE YOUR PRIVACY RIGHTS?" },
  { id: "dnt", label: "10. CONTROLS FOR DO-NOT-TRACK FEATURES" },
  { id: "policy-updates", label: "11. DO WE MAKE UPDATES TO THIS NOTICE?" },
  { id: "contact", label: "12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" },
  { id: "request", label: "13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?" },
]

function Privacy() {
  return (
    <PageLayout>
      <LegalCard label="Privacy Policy" title="GC Rentals Privacy Policy">
        <article className="space-y-10 text-gray-700">
          <section className="space-y-2">
            <p className="text-sm text-gray-500">Last updated March 10, 2026</p>
            <p>
              This Privacy Notice for GC Rentals ("we", "us", or "our") describes how and why we might access, collect,
              store, use, and/or share ("process") your personal information when you use our services ("Services"), including
              when you visit
              <a className="text-blue-600" href="https://gc-rentals.com" rel="noreferrer" target="_blank">
                https://gc-rentals.com
              </a>
              {" "}or engage with us in related ways such as marketing or events.
            </p>
            <p>
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. If you
              do not agree with our policies and practices, please do not use our Services. You can always reach us at
              <a className="text-blue-600" href="mailto:gcrentalscontact@gmail.com">
                gcrentalscontact@gmail.com
              </a>
              .
            </p>
          </section>

          <section id="summary" className="space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-900">Summary of Key Points</h2>
            <p>
              This summary highlights core ideas from our Privacy Notice. Use the links below or the table of contents to jump to
              any section for full details.
            </p>
            <ul className="list-disc space-y-3 pl-6">
              {summaryItems.map(({ question, answer, href }) => (
                <li key={href}>
                  <strong>{question}</strong> {answer}{" "}
                  <a className="text-blue-600" href={href}>
                    Learn more
                  </a>
                  .
                </li>
              ))}
            </ul>
          </section>

          <section id="toc" className="space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-900">Table of Contents</h2>
            <nav>
              <ol className="list-decimal space-y-1 pl-6">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a className="text-blue-600" href={`#${item.id}`}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          <section id="infocollect" className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">1. What information do we collect?</h2>
            <div id="personal-info" className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">Personal information you disclose to us</h3>
              <p>
                <em>In short: We collect personal information that you provide to us.</em>
              </p>
              <p>
                We collect personal information that you voluntarily provide when you register for the Services, express interest
                in our offerings, participate in activities, or otherwise contact us.
              </p>
              <p>
                <strong>Personal information provided by you.</strong> The information we collect depends on the context of your
                interactions and the choices you make. It may include:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Names</li>
                <li>Email addresses</li>
                <li>Usernames</li>
              </ul>
              <div id="sensitive-info" className="space-y-3">
                <p>
                  <strong>Sensitive information.</strong> When necessary, and with your consent or as otherwise permitted by law, we
                  may process categories such as financial data or genetic data.
                </p>
                <p>
                  <strong>Payment data.</strong> If you make purchases, we collect payment instrument numbers and security codes.
                  Payments are processed and stored by our payment partners, and their privacy notices apply.
                </p>
                <p>
                  <strong>Social media login data.</strong> If you register through a social account (for example Facebook or X), we
                  receive certain profile details from that provider as explained in the “How do we handle your social logins?”
                  section.
                </p>
              </div>
              <p>All personal information you provide must be true, complete, and accurate, and you must notify us of any changes.</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">Information automatically collected</h3>
              <p>
                <em>
                  In short: Some information—such as IP address and browser/device characteristics—is collected automatically when you
                  visit our Services.
                </em>
              </p>
              <p>
                We automatically collect device and usage data, including IP addresses, browser characteristics, operating system,
                language preferences, referring URLs, device name, country, location, and timestamps. This helps us secure our
                Services and produce analytics.
              </p>
              <p>Like many businesses, we also gather information through cookies and similar technologies.</p>
            </div>
            <div id="other-sources" className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">Information collected from other sources</h3>
              <p>
                <em>
                  In short: We may receive limited data from public databases, marketing partners, social media platforms, and other
                  outside sources.
                </em>
              </p>
              <p>
                To keep our records current and provide relevant offers, we may obtain information such as mailing addresses, job
                titles, email addresses, phone numbers, intent data, IP addresses, and social profiles from third parties. When you
                interact with us via social media, we may receive the personal information that platform makes available based on your
                privacy settings.
              </p>
            </div>
          </section>

          <section id="info-use" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">2. How do we process your information?</h2>
            <p>
              <em>
                In short: We process your information to provide, improve, and administer our Services, communicate with you, ensure
                security and fraud prevention, comply with law, and perform other tasks with your consent.
              </em>
            </p>
            <p>
              Examples include facilitating account creation, authenticating users, enabling user-to-user communications, requesting
              feedback, sending marketing communications (as permitted), protecting our Services, running prize draws, and meeting
              legal obligations.
            </p>
          </section>

          <section id="share" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">3. When and with whom do we share your personal information?</h2>
            <p>
              <em>In short: We may share information in specific situations described below and/or with specific third parties.</em>
            </p>
            <p>
              We may share your personal information during business transfers (such as mergers or acquisitions), with affiliates
              that honor this notice, or with business partners that help us offer products, services, or promotions.
            </p>
          </section>

          <section id="cookies" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">4. Do we use cookies and other tracking technologies?</h2>
            <p>
              <em>In short: We may use cookies and similar tracking technologies to collect and store information.</em>
            </p>
            <p>
              Cookies, web beacons, and pixels help us maintain security, prevent crashes, fix bugs, save preferences, and assist with
              basic site functionality. Third parties may use tracking technologies on our Services for analytics or advertising,
              including abandoned cart reminders. Refer to our Cookie Notice for details and opt-out options.
            </p>
          </section>

          <section id="social-logins" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">5. How do we handle your social logins?</h2>
            <p>
              <em>In short: If you register or log in using a social media account, we may receive certain information about you.</em>
            </p>
            <p>
              When you connect through third-party social accounts, we receive profile details (such as name, email, friends list, and
              avatar) in accordance with that provider’s policies. We use that data only for the purposes described here, but we do not
              control how those providers use your information. Review their privacy notices for details.
            </p>
          </section>

          <section id="info-retain" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">6. How long do we keep your information?</h2>
            <p>
              <em>In short: We keep your information as long as necessary to fulfil the purposes in this notice unless otherwise required by law.</em>
            </p>
            <p>
              We retain personal information for as long as you have an account or otherwise need the Services. When no longer necessary, we
              delete or anonymize data. If deletion is not immediately possible (for example in backups), we isolate and securely store the
              data until deletion is feasible.
            </p>
          </section>

          <section id="info-safe" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">7. How do we keep your information safe?</h2>
            <p>
              <em>In short: We aim to protect your personal information through organisational and technical security measures.</em>
            </p>
            <p>
              We implement safeguards designed to protect the information we process. However, no electronic transmission or storage technology
              is 100% secure, so we cannot guarantee absolute security. Access the Services within a secure environment whenever possible.
            </p>
          </section>

          <section id="minors" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">8. Do we collect information from minors?</h2>
            <p>
              <em>In short: We do not knowingly collect data from or market to children under 18 years of age.</em>
            </p>
            <p>
              By using the Services, you represent that you are at least 18 or the parent/guardian of a minor who uses the Services with your
              consent. If we learn that we collected information from minors, we will delete it promptly. Contact us if you believe we have any
              data from or about a child under 18.
            </p>
          </section>

          <section id="privacy-rights" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">9. What are your privacy rights?</h2>
            <p>
              <em>In short: You may review, change, or terminate your account at any time, subject to applicable laws.</em>
            </p>
            <p>
              <strong>Withdrawing your consent.</strong> Where we rely on consent, you may withdraw it at any time by contacting us via the details in
              the “How can you contact us?” section below. This will not affect processing that occurred before withdrawal.
            </p>
            <p>
              <strong>Account information.</strong> To review or update your account information, log in to your settings. Upon termination requests, we will
              deactivate or delete your account and information from active databases, retaining only what is needed for fraud prevention, troubleshooting,
              investigations, legal obligations, or enforcement of our terms.
            </p>
            <p>
              <strong>Cookies and similar technologies.</strong> Most browsers accept cookies by default. You can remove or reject cookies, though this may
              affect certain features or services.
            </p>
            <p>
              For questions about privacy rights, email
              <a className="text-blue-600" href="mailto:gcrentalscontact@gmail.com">
                gcrentalscontact@gmail.com
              </a>
              .
            </p>
          </section>

          <section id="dnt" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">10. Controls for Do-Not-Track features</h2>
            <p>
              Most browsers and some mobile operating systems include a Do-Not-Track (DNT) feature you can activate to signal that you prefer not to be
              tracked online. Because no uniform standard currently exists, we do not respond to DNT signals. If an online tracking standard is adopted, we
              will describe the process in an updated notice.
            </p>
          </section>

          <section id="policy-updates" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">11. Do we make updates to this notice?</h2>
            <p>
              <em>In short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
            </p>
            <p>
              We may update this Privacy Notice from time to time. The revised version will be indicated by an updated “Revised” date. If we make material
              changes, we may notify you via a prominent notice or direct communication. Review this notice frequently to stay informed.
            </p>
          </section>

          <section id="contact" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">12. How can you contact us about this notice?</h2>
            <p>If you have questions or comments, contact us by email or post:</p>
            <address className="not-italic">
              GC Rentals
              <br />
              41 C. de Pavía
              <br />
              Las Palmas de Gran Canaria, Canarias 35010
              <br />
              Spain
            </address>
            <p>
              Email:
              <a className="text-blue-600" href="mailto:gcrentalscontact@gmail.com">
                gcrentalscontact@gmail.com
              </a>
            </p>
          </section>

          <section id="request" className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">13. How can you review, update, or delete the data we collect from you?</h2>
            <p>
              Depending on your country’s privacy laws, you may have the right to request access to the personal information we collect, receive details about
              how we processed it, correct inaccuracies, delete your data, or withdraw consent. These rights may be limited in certain situations by law.
            </p>
            <p>
              To submit a request, fill out the
              <a className="text-blue-600" href="https://app.termly.io/dsar/a064e348-7de4-494a-b3f1-ebd6ff4fbc76" rel="noreferrer" target="_blank">
                data subject access request form
              </a>
              .
            </p>
            <p>
              This Privacy Policy was created using Termly’s
              <a className="text-blue-600" href="https://termly.io/products/privacy-policy-generator/" rel="noreferrer" target="_blank">
                Privacy Policy Generator
              </a>
              .
            </p>
          </section>
        </article>
      </LegalCard>
    </PageLayout>
  )
}

export default Privacy
