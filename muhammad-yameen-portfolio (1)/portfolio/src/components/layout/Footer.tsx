import { SocialLinkDTO } from '@/types';
import SocialIcons from '@/components/ui/SocialIcons';

export default function Footer({
  name,
  social,
}: {
  name: string;
  social: SocialLinkDTO[];
}) {
  return (
    <footer className="border-t border-bone/10 py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-bone-faint">
          © {new Date().getFullYear()} {name}. Crafted with care.
        </p>
        <SocialIcons social={social} size="sm" />
      </div>
    </footer>
  );
}
