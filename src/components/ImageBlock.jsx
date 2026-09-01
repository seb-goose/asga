import Image from "next/image";

export default function ImageBlock({ data }) {
  const image = data?.image;
  if (!image?.url) return null;

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div
        {...data.$?.image}
        className="relative aspect-video w-full"
      >
        <Image
          src={image.url}
          alt={image.title || ""}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
