export default function SectionHeading({ data }) {
  if (!data) return null;

  const { heading, subheading } = data;
  if (!heading) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 text-center">
      <h1
        {...data.$?.heading}
        className="font-heading text-3xl font-bold text-heritage-navy sm:text-4xl"
      >
        {heading}
      </h1>
      <div className="mx-auto mt-4 h-px w-16 bg-heritage-gold" />
      {subheading && (
        <p {...data.$?.subheading} className="font-body mt-4 text-lg text-heritage-navy/70">
          {subheading}
        </p>
      )}
    </div>
  );
}
