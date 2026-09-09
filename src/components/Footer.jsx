"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";

const FOOTER_REFERENCES = ["link_columns.links.page"];

const pageHref = (page) => page?.[0]?.url || "#";

const toSocialHref = (url) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
};

export default function Footer({ locale }) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // footer content is scoped independently, so it can't reuse the
      // homepage-typed initialData from DataContext - always hit the API.
      const data = await ContentstackClient.getElementByTypeWithRefs(
        "footer",
        locale,
        FOOTER_REFERENCES,
        null,
        ["url"],
      );
      setEntry(data?.[0] ?? null);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale]);

  const logo = entry?.logo;
  const nonprofitLines = entry?.nonprofit_text ? entry.nonprofit_text.split("\n") : [];
  const linkColumns = entry?.link_columns ?? [];
  const socialLinks = (entry?.social ?? [])
    .map((item) => ({
      label: item.title,
      href: toSocialHref(item.href),
      Icon: SOCIAL_ICONS[item.title?.toLowerCase()] ?? null,
    }))
    .filter((item) => item.href);

  return (
    <footer className="bg-heritage-navy text-warm-cream">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex items-start gap-5 sm:col-span-3 lg:col-span-2">
            {logo?.url && (
              <Image
                src={logo.url}
                alt={entry?.business_name || logo.title || ""}
                width={112}
                height={112}
                className="h-24 w-24 shrink-0"
              />
            )}
            <div>
              {entry?.business_name && (
                <Link
                  href="/"
                  className="font-heading text-sm leading-tight font-bold uppercase"
                >
                  {entry.business_name}
                </Link>
              )}
              {nonprofitLines.length > 0 && (
                <p className="font-body mt-4 text-sm leading-relaxed text-warm-cream/70">
                  {nonprofitLines.map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      {index < nonprofitLines.length - 1 && <br />}
                    </Fragment>
                  ))}
                </p>
              )}
            </div>
          </div>

          {linkColumns.map((column, index) => (
            <FooterColumn
              key={column._metadata?.uid ?? index}
              title={column.title}
              links={column.links ?? []}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-warm-cream/10 pt-8 text-center">
          {entry?.contact_text && (
            <p className="font-heading text-sm font-bold tracking-wide text-heritage-gold uppercase">
              {entry.contact_text}
            </p>
          )}
          {entry?.contact_email && (
            <a
              href={`mailto:${entry.contact_email}`}
              className="text-sm text-warm-cream/80 hover:text-heritage-gold"
            >
              {entry.contact_email}
            </a>
          )}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="text-warm-cream/80 hover:text-heritage-gold"
              >
                {Icon ? <Icon className="h-8 w-8" /> : label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {entry?.legal && (
        <div className="border-t border-warm-cream/10 px-6 py-6 text-center text-xs text-warm-cream/50">
          {entry.legal}
        </div>
      )}
    </footer>
  );
}

function FooterColumn({ title, links }) {
  if (!title && !links.length) return null;

  return (
    <div>
      {title && (
        <p className="font-heading text-sm font-bold tracking-wide text-heritage-gold uppercase">
          {title}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {links.map((link, index) => (
          <li key={link._metadata?.uid ?? index}>
            <Link
              href={pageHref(link.page)}
              className="font-body text-sm text-warm-cream/80 hover:text-heritage-gold"
            >
              {link.text}
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
