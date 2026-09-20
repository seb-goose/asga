import BoardMemberCard from "@/components/BoardMemberCard";
import { cslp } from "@/lib/contentstack-client";

export default function BoardMembers({ data }) {
  if (!data) return null;

  const { headline, members = [] } = data;
  if (!members.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        {headline && (
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-heritage-gold/60" />
            <h2
              {...data.$?.headline}
              className="font-heading text-2xl tracking-widest text-heritage-navy uppercase"
            >
              {headline}
            </h2>
            <span className="h-px w-12 bg-heritage-gold/60" />
          </div>
        )}

        <div>
          {members.map((member, index) => (
            <BoardMemberCard
              key={member._metadata?.uid ?? index}
              data={member}
              itemProps={cslp(data, "members__", index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
