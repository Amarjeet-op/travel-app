export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-muted-foreground mb-4">
              We collect the following information to provide our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Account information (email, name, phone number)</li>
              <li>Profile information (gender, age, home city, bio, photo)</li>
              <li>Emergency contact details</li>
              <li>Trip data and travel preferences</li>
              <li>Messages and conversation data</li>
              <li>Location data (only with explicit consent for SOS features)</li>
              <li>Usage analytics and device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="text-muted-foreground">
              All data is stored securely on Google Cloud Platform (Firebase) with servers located in asia-south1 (Mumbai). We use encryption for data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under India&apos;s Digital Personal Data Protection (DPDP) Act 2023, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Grievance redressal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data as long as your account is active. Upon account deletion, all personal data is removed within 30 days, except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We use Firebase (Google), Gemini API (Google), and OpenStreetMap. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              For data-related queries, contact us at <a href="mailto:privacy@abhayam.com" className="text-primary hover:underline">privacy@abhayam.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
