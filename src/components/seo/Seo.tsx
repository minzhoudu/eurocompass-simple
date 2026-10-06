import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "../../config";

type SeoProps = {
  // Under ~60 characters: longer titles are cut off in search results.
  title: string;
  // Under ~160 characters.
  description: string;
  // The page's own path ("/rezervacije"), for the canonical link.
  path: string;
  // Keep a page out of search results (404, placeholder pages).
  noindex?: boolean;
  // Structured data (schema.org) to embed as JSON-LD.
  jsonLd?: Record<string, unknown>;
};

// The one place every public page sets its search / sharing metadata. The same
// information is also written statically into index.html for crawlers and
// link-preview bots that do not run JavaScript; once the app is running those
// static copies are removed so each tag appears exactly once.
export const Seo = ({
  title,
  description,
  path,
  noindex = false,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    document
      .querySelectorAll("[data-static-seo]")
      .forEach((element) => element.remove());
  }, []);

  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const image = `${SITE_URL}${SOCIAL_IMAGE.path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="sr_RS" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(SOCIAL_IMAGE.width)} />
      <meta property="og:image:height" content={String(SOCIAL_IMAGE.height)} />
      <meta property="og:image:alt" content={SOCIAL_IMAGE.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
