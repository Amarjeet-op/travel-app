export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">About Abhayam</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Abhayam (अभयम्) — Sanskrit for &quot;Fearlessness&quot; — is a modern travel safety and companion matching platform designed for India.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              We believe everyone should be able to travel fearlessly. Abhayam empowers travelers across India to find verified travel companions, check area safety with AI, and stay connected with emergency support — all in one platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li><strong>Travel Companion Matching:</strong> Post and discover trips across Indian cities, connect with verified travelers.</li>
              <li><strong>AI Safety Checker:</strong> Get real-time safety assessments for any area using Google&apos;s Gemini AI with search grounding.</li>
              <li><strong>Real-time Chat:</strong> Communicate securely with your matched travel companions.</li>
              <li><strong>Emergency SOS:</strong> One-tap emergency alerts with location sharing and emergency contacts.</li>
              <li><strong>Admin Oversight:</strong> Verification system for user accounts, safety reports, and moderation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Safety First</h2>
            <p className="text-muted-foreground">
              Built with a strong focus on women&apos;s safety while being inclusive to all travelers. Every user goes through a verification process, and our AI-powered safety checker helps you make informed decisions about where and when to travel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p className="text-muted-foreground">
              Abhayam is built with Next.js, Firebase, and Google&apos;s Gemini AI. We use OpenStreetMap for maps, and our platform is designed to be fast, accessible, and secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
