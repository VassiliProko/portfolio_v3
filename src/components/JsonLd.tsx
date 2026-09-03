type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

/** Renders static structured data for search engines and AI crawlers. */
export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
