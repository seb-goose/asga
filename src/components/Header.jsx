"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import { createClient } from "@/lib/supabase/client";

const HEADER_REFERENCES = [
  "buttons.page",
  "menu_items.page",
  "menu_items.items.page",
  "menu_items.items.sub_items.page",
];

// Stub content types exist only so editors can assign a link in the CMS;
// they have no fields of their own, so their route is hardcoded here.
const STUB_CONTENT_TYPE_ROUTES = {
  registration_page: "/register",
};

const pageHref = (page) => {
  const ref = page?.[0];
  if (!ref) return "#";
  return STUB_CONTENT_TYPE_ROUTES[ref._content_type_uid] || ref.url || "#";
};

const toSocialHref = (url) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export default function Header({ locale }) {
  const router = useRouter();
  const [entry, setEntry] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [member, setMember] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // header content is scoped independently, so it can't reuse the
      // homepage-typed initialData from DataContext - always hit the API.
      const data = await ContentstackClient.getElementByTypeWithRefs(
        "header",
        locale,
        HEADER_REFERENCES,
        null,
        ["url"],
      );
      setEntry(data?.[0] ?? null);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const loadMember = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) setMember(null);
        return;
      }

      const { data } = await supabase
        .from("members")
        .select("first_name")
        .eq("id", user.id)
        .single();

      if (active) setMember(data);
    };

    loadMember();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadMember();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const logo = entry?.logo;
  const titleLines = entry?.title_text ? entry.title_text.split("\n") : [];
  const buttons = entry?.buttons ?? [];
  const navItems = entry?.menu_items ?? [];
  const socialLinks = [
    { label: "Facebook", href: toSocialHref(entry?.facebook_url), Icon: FacebookIcon },
    { label: "Instagram", href: toSocialHref(entry?.instagram_url), Icon: InstagramIcon },
  ].filter((social) => social.href);

  return (
    <header>
      <div className="flex h-12 items-center bg-heritage-navy px-4 lg:h-6 lg:px-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          className="text-warm-cream lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6 lg:py-5 lg:px-10">
          <Link
            href="/"
            className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:gap-4 lg:text-left"
          >
            {logo?.url && (
              <Image
                src={logo.url}
                alt={entry?.title_text?.replace(/\n/g, " ") || logo.title || ""}
                width={144}
                height={144}
                className="h-24 w-24 lg:h-36 lg:w-36"
                priority
              />
            )}
            <div>
              <p className="font-heading text-xl leading-none font-semibold tracking-wide text-heritage-navy uppercase sm:text-2xl lg:text-3xl">
                {titleLines.map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    {index < titleLines.length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
              {entry?.mission_text && (
                <p className="font-heading mt-1 text-base text-heritage-teal sm:text-lg">
                  {entry.mission_text}
                </p>
              )}
            </div>
          </Link>

          <div className="flex w-full flex-col items-center gap-4 lg:w-auto lg:items-end lg:gap-0">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-heritage-navy lg:flex-nowrap lg:justify-end lg:gap-5">
              {entry?.contact?.link_text && (
                <Link
                  href={entry.contact.mailto ? `mailto:${entry.contact.mailto}` : "#"}
                  className="hover:text-heritage-gold"
                >
                  {entry.contact.link_text}
                </Link>
              )}
              {member ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1 hover:text-heritage-gold"
                  >
                    Welcome {member.first_name}
                    <ChevronDownIcon
                      className={`h-3 w-3 opacity-80 ${accountMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 top-full z-20 mt-2 min-w-40 border border-stone-gray bg-white py-1 shadow-lg">
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-heritage-navy hover:bg-warm-cream"
                      >
                        Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-sm text-heritage-navy hover:bg-warm-cream"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                entry?.login && (
                  <Link href="/login" className="hover:text-heritage-gold">
                    {entry.login}
                  </Link>
                )
              )}
              <div className="flex items-center gap-1.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="text-heritage-navy hover:text-heritage-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-1 items-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {buttons.map((button, index) => {
                  const isDonate = button.text?.toLowerCase().includes("donate");
                  return isDonate ? (
                    <Link
                      key={button._metadata?.uid ?? index}
                      href={pageHref(button.page)}
                      className="flex items-center gap-2 bg-heritage-gold px-5 py-2.5 text-xs font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90"
                    >
                      <HeartIcon className="h-3.5 w-3.5" />
                      {button.text}
                    </Link>
                  ) : (
                    <Link
                      key={button._metadata?.uid ?? index}
                      href={pageHref(button.page)}
                      className="bg-heritage-navy px-5 py-2.5 text-xs font-bold tracking-wider text-warm-cream uppercase hover:bg-classic-navy"
                    >
                      {button.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden bg-heritage-navy lg:block">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center px-6">
          {navItems.map((item, index) => {
            const hasChildren = item.items && item.items.length > 0;
            return (
              <li key={item._metadata?.uid ?? index} className="group relative">
                <Link
                  href={pageHref(item.page)}
                  className="flex items-center gap-1 px-4 py-4 text-sm font-semibold tracking-wide text-warm-cream uppercase hover:bg-classic-navy"
                >
                  {item.text}
                  {hasChildren && <ChevronDownIcon className="h-3 w-3 opacity-80" />}
                </Link>
                {hasChildren && (
                  <ul className="invisible absolute left-0 top-full z-20 min-w-[220px] bg-classic-navy py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {item.items.map((child, childIndex) => {
                      const hasGrandchildren = child.sub_items && child.sub_items.length > 0;
                      return (
                        <li
                          key={child._metadata?.uid ?? childIndex}
                          className={hasGrandchildren ? "group/child relative" : undefined}
                        >
                          <Link
                            href={pageHref(child.page)}
                            className="flex items-center justify-between gap-1 px-5 py-2.5 text-sm text-warm-cream hover:bg-heritage-navy"
                          >
                            {child.text}
                            {hasGrandchildren && (
                              <ChevronDownIcon className="h-3 w-3 -rotate-90 opacity-80" />
                            )}
                          </Link>
                          {hasGrandchildren && (
                            <ul className="invisible absolute left-full top-0 z-20 min-w-[220px] bg-classic-navy py-2 opacity-0 shadow-lg transition group-hover/child:visible group-hover/child:opacity-100">
                              {child.sub_items.map((grandchild, grandchildIndex) => (
                                <li key={grandchild._metadata?.uid ?? grandchildIndex}>
                                  <Link
                                    href={pageHref(grandchild.page)}
                                    className="block px-5 py-2.5 text-sm text-warm-cream hover:bg-heritage-navy"
                                  >
                                    {grandchild.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="h-6 bg-heritage-navy lg:hidden" />

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-heritage-navy lg:hidden"
        >
          <div className="flex items-center justify-end px-6 py-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="text-warm-cream"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="pb-4">
            {navItems.map((item, index) => {
              const hasChildren = item.items && item.items.length > 0;
              return hasChildren ? (
                <li key={item._metadata?.uid ?? index} className="border-b border-classic-navy">
                  <details className="group/details">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3 text-sm font-semibold tracking-wide text-warm-cream uppercase">
                      {item.text}
                      <ChevronDownIcon className="h-3 w-3 opacity-80 group-open/details:rotate-180" />
                    </summary>
                    <ul className="bg-classic-navy pb-2">
                      {item.items.map((child, childIndex) => {
                        const hasGrandchildren = child.sub_items && child.sub_items.length > 0;
                        return hasGrandchildren ? (
                          <li key={child._metadata?.uid ?? childIndex}>
                            <details className="group/subdetails">
                              <summary className="flex cursor-pointer list-none items-center justify-between px-9 py-2.5 text-sm text-warm-cream">
                                {child.text}
                                <ChevronDownIcon className="h-3 w-3 opacity-80 group-open/subdetails:rotate-180" />
                              </summary>
                              <ul className="bg-heritage-navy pb-1">
                                {child.sub_items.map((grandchild, grandchildIndex) => (
                                  <li key={grandchild._metadata?.uid ?? grandchildIndex}>
                                    <Link
                                      href={pageHref(grandchild.page)}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block px-12 py-2 text-sm text-warm-cream hover:text-heritage-gold"
                                    >
                                      {grandchild.text}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </li>
                        ) : (
                          <li key={child._metadata?.uid ?? childIndex}>
                            <Link
                              href={pageHref(child.page)}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-9 py-2.5 text-sm text-warm-cream hover:text-heritage-gold"
                            >
                              {child.text}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item._metadata?.uid ?? index} className="border-b border-classic-navy">
                  <Link
                    href={pageHref(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-semibold tracking-wide text-warm-cream uppercase"
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.972C4.045 12.687 2 10.408 2 7.5 2 5.015 3.99 3 6.5 3c1.386 0 2.632.63 3.5 1.667C10.868 3.63 12.114 3 13.5 3 16.01 3 18 5.015 18 7.5c0 2.908-2.045 5.187-3.885 6.748a22.045 22.045 0 01-3.744 2.654l-.019.01-.005.003h-.002a.739.739 0 01-.69 0h-.002z" />
    </svg>
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
