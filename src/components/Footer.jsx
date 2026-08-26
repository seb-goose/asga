import Image from "next/image";
import Link from "next/link";

const LOGO_URL =
  "https://images.contentstack.io/v3/assets/blt952383dd64c12cac/bltb8e63adc50e49ce0/69d2c5761604ee7ef1875789/metal_logo.avif";

const EXPLORE_LINKS = [
  { label: "Education", href: "/education" },
  { label: "Breeders Directory", href: "/breeders/directory" },
  { label: "International", href: "/international" },
  { label: "Videos", href: "/videos" },
  { label: "Calendar", href: "/calendar" },
];

const ASSOCIATION_LINKS = [
  { label: "Membership", href: "/members" },
  { label: "Club Documents", href: "/documents" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Merchandise", href: "/merchandise" },
  { label: "FAQ", href: "/faq" },
];

const RESOURCE_LINKS = [
  { label: "Health & Testing", href: "/health-and-testing" },
  { label: "Youth Program", href: "/youth-program" },
  { label: "Photo Gallery", href: "/photo-gallery" },
  { label: "Donate", href: "/donate" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="bg-heritage-navy text-warm-cream">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex items-start gap-5 sm:col-span-3 lg:col-span-2">
            <Image
              src={LOGO_URL}
              alt="American Sebastopol Goose Association"
              width={112}
              height={112}
              className="h-24 w-24 shrink-0"
            />
            <div>
              <Link
                href="/"
                className="font-heading text-sm leading-tight font-bold uppercase"
              >
                American Sebastopol
                <br />
                Goose Association
              </Link>
              <p className="font-body mt-4 text-sm text-warm-cream/70">
                A 501(c)(3) Nonprofit Organization
              </p>
              <p className="font-body text-sm text-warm-cream/70">
                EIN: 99-99999999
              </p>
            </div>
          </div>

          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Association" links={ASSOCIATION_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-warm-cream/10 pt-8 text-center">
          <p className="font-heading text-sm font-bold tracking-wide text-heritage-gold uppercase">
            Connect With Us
          </p>
          <a
            href="mailto:info@americansebastopolgoose.org"
            className="text-sm text-warm-cream/80 hover:text-heritage-gold"
          >
            info@americansebastopolgoose.org
          </a>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="text-warm-cream/80 hover:text-heritage-gold"
              >
                <Icon className="h-8 w-8" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-warm-cream/10 px-6 py-6 text-center text-xs text-warm-cream/50">
        © {new Date().getFullYear()} American Sebastopol Goose Association.
        All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="font-heading text-sm font-bold tracking-wide text-heritage-gold uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="font-body text-sm text-warm-cream/80 hover:text-heritage-gold"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.36c-.26-.04-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.75V10.5H8V13.5h2.65V21h2.85z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 5.7a2.2 2.2 0 110-4.4 2.2 2.2 0 010 4.4zM16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zm3.7 13a3.7 3.7 0 01-3.7 3.7H8A3.7 3.7 0 014.3 16V8A3.7 3.7 0 018 4.3h8A3.7 3.7 0 0119.7 8v8zM16.3 7.1a.9.9 0 100 1.8.9.9 0 000-1.8z" />
    </svg>
  );
}
