import Image from "next/image";
import { cslp } from "@/lib/contentstack-client";

export default function BoardMemberCard({ data, itemProps }) {
  if (!data) return null;

  const { name, title, email, image, bio, quote, gallery = [], gallery_description } = data;

  return (
    <div
      {...itemProps}
      className="flex flex-col gap-8 border-b border-stone-gray/60 py-12 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:gap-10"
    >
      <div className="mx-auto w-40 shrink-0 sm:mx-0">
        <div
          {...data.$?.image}
          className="relative aspect-square overflow-hidden rounded-full bg-stone-gray/40"
        >
          {image?.url ? (
            <Image
              src={image.url}
              alt={name ?? ""}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholderIcon className="absolute inset-0 m-auto h-10 w-10 text-heritage-navy/30" />
          )}
        </div>
      </div>

      <div className="text-center sm:text-left">
        <h3 {...data.$?.name} className="font-heading text-2xl font-bold text-heritage-navy">
          {name}
        </h3>
        {title && (
          <p {...data.$?.title} className="font-body mt-1 text-sm font-semibold tracking-wide text-heritage-gold uppercase">
            {title}
          </p>
        )}

        {email && (
          <a
            {...data.$?.email}
            href={`mailto:${email}`}
            className="font-body mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-heritage-navy/70 hover:text-heritage-teal hover:underline sm:justify-start"
          >
            <MailIcon className="h-4 w-4 shrink-0" />
            {email}
          </a>
        )}

        {bio && (
          <div
            {...data.$?.bio}
            className="font-body mt-4 text-base leading-relaxed text-heritage-navy/80
              [&_p]:mt-4 [&_p]:first:mt-0
              [&_a]:cursor-pointer [&_a]:text-heritage-teal [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        )}

        {quote && (
          <p {...data.$?.quote} className="font-body mt-4 border-l-2 border-heritage-gold pl-4 text-base text-heritage-navy/70 italic">
            <span className="font-semibold text-heritage-gold not-italic">
              Favorite Quote:
            </span>{" "}
            {quote}
          </p>
        )}

        {gallery.length > 0 && (
          <div className="mt-6">
            <p className="font-heading text-sm font-bold text-heritage-navy uppercase">
              Show Highlights
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
              {gallery.map((item, index) => (
                <div
                  key={item._metadata?.uid ?? index}
                  {...cslp(data, "gallery__", index)}
                  className="relative aspect-square w-28 overflow-hidden rounded-md bg-stone-gray/40"
                >
                  {item.image?.url && (
                    <Image
                      src={item.image.url}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            {gallery_description && (
              <p {...data.$?.gallery_description} className="font-body mt-2 text-sm text-heritage-navy/60 italic">
                {gallery_description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MailIcon(props) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
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
