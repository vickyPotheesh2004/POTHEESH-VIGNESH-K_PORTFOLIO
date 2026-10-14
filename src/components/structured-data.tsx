interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

/**
 * Renders JSON-LD. The payload is serialised with `<` escaped so a value
 * containing markup cannot break out of the script element.
 */
export function StructuredData({ data, id }: StructuredDataProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
