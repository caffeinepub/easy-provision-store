import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'easy-provision-store'
  );

  return (
    <footer className="border-t bg-muted/30 py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Easy Provision Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 fill-primary text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
