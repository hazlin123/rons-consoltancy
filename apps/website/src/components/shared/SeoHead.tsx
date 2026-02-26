import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SeoHead = ({
    title = "Ron's Futurebridge Consultancy | IELTS & Study Abroad Kenya",
    description = "Expert IELTS coaching and overseas education consulting in Kenya. Your bridge to global universities.",
    image = "/logo-gold.png",
    url = "https://ronsfuturebridge.com"
}: SeoHeadProps) => {
    const fullTitle = title === "Ron's Futurebridge Consultancy | IELTS & Study Abroad Kenya"
        ? title
        : `${title} | Ron's Futurebridge Consultancy`;

    return (
        <Helmet>
            {/* Basic Meta */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Ron's Futurebridge Consultancy" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
