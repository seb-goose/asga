export default function DocumentLinkBlock({ data }) {
  const link = data?.link;
  if (!link?.href) return null;

  return (
    <div className="font-body mx-auto max-w-5xl px-6 py-4">
      <a
        {...data.$?.link}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-2 font-heading text-lg text-heritage-teal underline underline-offset-2 hover:text-heritage-navy"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
        </svg>
        {link.title}
      </a>
    </div>
  );
}
