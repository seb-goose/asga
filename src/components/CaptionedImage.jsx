import Image from "next/image";

const WIDTHS = {
  sm: "max-w-[260px]",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export default function CaptionedImage({ data }) {
  if (!data) return null;

  const { image, caption, size = "md" } = data;
  if (!image?.url) return null;

  return (
    <figure className={`mx-auto my-8 px-6 ${WIDTHS[size] ?? WIDTHS.md}`}>
      <div {...data.$?.image}>
        <Image
          src={image.url}
          alt={image.title || caption || ""}
          width={image.dimension?.width ?? 700}
          height={image.dimension?.height ?? 500}
          className="h-auto w-full rounded-lg object-contain"
        />
      </div>
      {caption && (
        <figcaption
          {...data.$?.caption}
          className="font-body mt-3 text-center text-sm text-heritage-navy/60 italic"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
