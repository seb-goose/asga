import Image from "next/image";
import Link from "next/link";

const pageHref = (page) => page?.[0]?.url || "#";

export default function TextAndImage({ data }) {
  if (!data) return null;

  const {
    image,
    image_right,
    background_color,
    headline_text_color,
    body_text_color,
    headline,
    headline_decoration,
    body,
    checked_items = [],
    button_text,
    page,
  } = data;

  return (
    <section
      style={{
        "--section-bg": background_color?.hex,
        "--headline-color": headline_text_color?.hex,
        "--body-color": body_text_color?.hex,
      }}
      className="bg-(--section-bg)"
    >
      <div className="grid lg:grid-cols-2">
        <div
          className={`relative h-80 overflow-hidden lg:h-auto ${image_right ? "lg:order-2" : ""}`}
        >
          {image?.url && <Image src={image.url} alt="" fill className="object-cover" />}
          <div
            className={`absolute inset-0 ${
              image_right
                ? "bg-linear-to-l from-transparent from-65% to-(--section-bg) to-100%"
                : "bg-linear-to-r from-transparent from-65% to-(--section-bg) to-100%"
            }`}
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-16 text-center lg:px-16">
          <div className="flex items-center justify-center gap-4">
            {headline_decoration && (
              <span className="h-px w-12 bg-(--headline-color)/60" />
            )}
            <h2 className="font-heading text-2xl tracking-widest text-(--headline-color) uppercase">
              {headline}
            </h2>
            {headline_decoration && (
              <span className="h-px w-12 bg-(--headline-color)/60" />
            )}
          </div>

          {body && (
            <p className="font-body mx-auto mt-6 max-w-xl text-lg text-(--body-color)">
              {body}
            </p>
          )}

          {checked_items.length > 0 && (
            <div className="mx-auto mt-8 grid grid-cols-2 grid-rows-3 grid-flow-col gap-x-10 gap-y-4">
              {checked_items.map((point, index) => (
                <div key={point._metadata?.uid ?? index} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 shrink-0 text-(--headline-color)" />
                  <span className="font-body text-left text-(--body-color)">
                    {point.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {button_text && (
            <div className="mt-10 flex justify-center">
              <Link
                href={pageHref(page)}
                className="border border-(--headline-color) px-8 py-3 text-sm font-bold tracking-wider text-(--headline-color) uppercase hover:bg-(--headline-color) hover:text-(--section-bg)"
              >
                {button_text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth={1.5} />
      <path
        d="M8 12.3l2.6 2.6L16.2 9"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
