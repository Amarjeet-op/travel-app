import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-12">
      <div className="container-wide">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg font-display">A</span>
              </div>
              <span className="font-display font-semibold text-xl">Abhayam</span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Travel fearlessly with verified companions and AI-powered safety checks. Your journey, our priority.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/trips" className="text-sm text-muted-foreground hover:text-primary transition-colors">Find Trips</Link></li>
              <li><Link href="/safety-checker" className="text-sm text-muted-foreground hover:text-primary transition-colors">Safety Checker</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 font-display">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Abhayam. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-calligraphy text-lg">
            Travel Fearlessly, Together
          </p>
        </div>
      </div>
    </footer>
  );
}