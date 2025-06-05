import { Metadata } from "next";
import Markdown from "markdown-to-jsx";
import { markdownParser } from "@/app/utils/markdown-parser";
import { firaSansFont } from "@/app/lib/fonts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getMarkDownData(slug: string) {
  return markdownParser("legal", slug);
}

// Generate the metadata for the legal page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageURL = process.env.BASE_URL + `/legal/${slug}`;
  const data = getMarkDownData(slug);

  return {
    metadataBase: new URL(process.env.BASE_URL as string),
    title: `${data.metaData.title} - ${process.env.SITE_NAME}`,
    description: data.metaData.description,
    keywords: data.metaData.keywords,
    authors: [
      {
        name: "Manas",
        url: "https://scienmanas.xyz",
      },
      {
        name: "Nikhil Srivastava",
        url: "https://nikhilsrv.page",
      },
    ],
    robots: "index, follow",
    openGraph: {
      title: `${data.metaData.title} - ${process.env.SITE_NAME}`,
      description: data.metaData.description,
      url: pageURL,
      type: "article",
      siteName: `${process.env.SITE_NAME}`,
      locale: "en_US",
      authors: ["Manas", "Nikhil Srivastava"],
    },
    twitter: {
      card: "summary",
      title: `${data.metaData.title} - ${process.env.SITE_NAME}`,
      description: data.metaData.description,
      creator: "@scienmanas",
      site: pageURL,
    },
  };
}

export default async function PrivacyPolicy({ params }: PageProps) {
  const { slug } = await params;
  const data = markdownParser("legal", slug);

  return (
    <section
      className={`w-full h-fit flex items-center justify-center ${firaSansFont.className}`}
    >
      <div className="wrapper w-full max-w-screen-xl h-fit flex items-center justify-center">
        <div className="content w-full h-fit flex flex-col gap-6 items-start">
          <div className="heading font-semibold text-2xl sm:text-3xl md:text-4xl underline">
            {data.heading}
          </div>
          <div className="content text-base text-neutral-700 dark:text-neutral-300 sm:text-lg markdown font-mono">
            <Markdown>{data.content}</Markdown>
          </div>
        </div>
      </div>
    </section>
  );
}
