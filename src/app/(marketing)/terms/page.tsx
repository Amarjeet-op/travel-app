export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By using Abhayam, you agree to these terms. If you do not agree, do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You must provide accurate information during registration. You are responsible for maintaining the security of your account. Abhayam reserves the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Verification</h2>
            <p className="text-muted-foreground">
              Users must complete profile verification before posting trips. Abhayam admins review verification requests. Providing false information may result in account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Content Policies</h2>
            <p className="text-muted-foreground mb-4">
              You may not post content that is:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Harassing, abusive, or threatening</li>
              <li>False or misleading</li>
              <li>Illegal or promoting illegal activity</li>
              <li>Infringing on intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. SOS Feature Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The SOS feature is a supplementary safety tool and is NOT a replacement for emergency services. In case of immediate danger, always call 112 (national emergency number) first. Abhayam is not liable for any delays or failures in SOS alert delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. AI Safety Checker</h2>
            <p className="text-muted-foreground">
              Safety assessments are AI-generated and should be used as guidance only. Always exercise personal judgment and stay informed about local conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Liability</h2>
            <p className="text-muted-foreground">
              Abhayam is a platform for connecting travelers. We do not guarantee the safety of any trip or companion. Users travel at their own risk. Abhayam is not liable for any incidents, damages, or losses arising from the use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
