import Image from "next/image";
import Link from "next/link";

const pageHref = (page) => page?.[0]?.url || "#";

export default function ResourceGrid({ cards = [], cta }) {
  if (!cards.length && !cta) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-6 lg:px-10">
        {cards.map((card, index) => (
          <div
            key={card._metadata?.uid ?? index}
            className="flex h-full flex-col overflow-hidden rounded-lg shadow-md lg:col-span-1"
          >
            <div className="relative flex aspect-4/3 items-center justify-center bg-stone-gray/40">
              {card.image?.url ? (
                <Image src={card.image.url} alt="" fill className="object-cover" />
              ) : (
                <ImagePlaceholderIcon className="h-10 w-10 text-heritage-navy/30" />
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 text-center">
              <p className="font-heading flex min-h-10 items-center justify-center text-base font-bold text-heritage-navy uppercase">
                {card.headline}
              </p>
              <p className="font-body mt-1 text-sm text-heritage-navy/70">
                {card.details}
              </p>
              <Link
                href={pageHref(card.page)}
                className="mt-auto inline-flex items-center gap-1 self-center pt-4 text-sm font-semibold text-heritage-navy hover:underline"
              >
                {card.link_text}
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}

        {cta && (
          <div className="flex flex-col justify-center rounded-lg border border-heritage-gold px-8 py-8 text-center lg:col-span-2">
            <h2 className="font-heading text-xl font-bold text-heritage-navy uppercase">
              {cta.headline}
            </h2>
            <p className="font-body mt-3 text-sm text-heritage-navy/70">
              {cta.body}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {cta.button_1_text && (
                <Link
                  href={pageHref(cta.button_1_page)}
                  className="rounded-md bg-heritage-gold px-6 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90"
                >
                  {cta.button_1_text}
                </Link>
              )}
              {cta.button_2_text && (
                <Link
                  href={pageHref(cta.button_2_page)}
                  className="rounded-md bg-heritage-navy px-6 py-3 text-sm font-bold tracking-wider text-warm-cream uppercase hover:bg-classic-navy"
                >
                  {cta.button_2_text}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ImagePlaceholderIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5-8 8" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}
