export default function RichTextBlock({ data }) {
  const text = data?.text;
  if (!text) return null;

  return (
    <div
      {...data.$?.text}
      className="font-body mx-auto max-w-5xl px-6 py-8 text-heritage-navy
        [&_h1]:font-heading [&_h2]:font-heading [&_h3]:font-heading
        [&_h1]:mt-8 [&_h2]:mt-8 [&_h3]:mt-6 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl
        [&_p]:mt-4 [&_p]:leading-relaxed
        [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:mt-1
        [&_a]:text-heritage-teal [&_a]:underline
        [&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-heritage-gold [&_blockquote]:pl-4 [&_blockquote]:italic
        [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-stone-gray/20 [&_pre]:p-4
        [&_code]:rounded [&_code]:bg-stone-gray/20 [&_code]:px-1
        [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse
        [&_th]:border [&_th]:border-stone-gray [&_th]:p-2 [&_th]:text-left
        [&_td]:border [&_td]:border-stone-gray [&_td]:p-2
        [&_img]:mt-4 [&_img]:max-w-full"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
