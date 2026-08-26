import Image from "next/image";
import Link from "next/link";

const pageHref = (page) => page?.[0]?.url || "#";

export default function QuickLinks({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-12 px-6 lg:gap-x-0 lg:px-10 lg:[&>*+*]:relative lg:[&>*+*]:before:absolute lg:[&>*+*]:before:inset-y-0 lg:[&>*+*]:before:left-0 lg:[&>*+*]:before:w-0.5 lg:[&>*+*]:before:bg-[linear-gradient(to_bottom,transparent_0%,rgba(13,27,51,0.2)_35%,rgba(13,27,51,0.2)_90%,transparent_100%)] lg:[&>*+*]:before:content-['']">
        {items.map((item, index) => (
          <div
            key={item._metadata?.uid ?? index}
            className="flex h-full w-[calc(50%-0.75rem)] flex-col text-center sm:w-[calc(33.333%-1rem)] lg:w-1/6 lg:px-6"
          >
            {item.image?.url && (
              <Image
                src={item.image.url}
                alt=""
                width={80}
                height={80}
                className="mx-auto h-20 w-20 object-contain"
              />
            )}
            <p className="font-heading mt-4 flex min-h-10 items-center justify-center text-sm font-bold tracking-wide text-heritage-navy uppercase">
              {item.title}
            </p>
            <p className="font-body mt-2 text-sm text-heritage-navy/70">
              {item.details}
            </p>
            <Link
              href={pageHref(item.page)}
              className="mt-auto inline-flex items-center gap-1 self-center pt-4 text-sm font-semibold text-heritage-navy hover:underline"
            >
              {item.link_text}
              <ChevronRightIcon className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
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
