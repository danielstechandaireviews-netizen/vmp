import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABlock } from "@/components/CTABlock";
import { Icon } from "@/components/Icon";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { toolMetadata } from "@/components/ToolLayout";
import { formatDate } from "@/lib/blog";
import { EXPIRY_SCRIPT, getActiveNuggets, getNugget } from "@/lib/nuggets";
import { SITE_URL } from "@/lib/packages";

export const dynamicParams = false;

// Static export needs at least one path; "none" renders the 404 page when no nugget is live.
export function generateStaticParams() {
  const slugs = getActiveNuggets().map((n) => ({ slug: n.slug }));
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNugget((await params).slug);
  if (!n) return {};
  const meta = toolMetadata({ title: `${n.title} | YouTube Daily Nugget`, description: n.summary, path: `/nuggets/${n.slug}` });
  const images = n.feedImage ? [{ url: n.feedImage, width: 1080, height: 1350, alt: n.title }] : undefined;
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: n.date, ...(images && { images }) },
    twitter: { ...meta.twitter, ...(images && { images: [n.feedImage!] }) },
  };
}

export default async function NuggetPage({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNugget((await params).slug);
  if (!n) notFound();
  const others = getActiveNuggets().filter((o) => o.slug !== n.slug).slice(0, 3);

  const url = `${SITE_URL}/nuggets/${n.slug}`;
  const text = `${n.title} | Today's YouTube nugget from ViralMoniPoint`;
  const enc = encodeURIComponent;
  const share = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
  ];
  const btn = "inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-4 py-2 text-[13.5px] font-extrabold text-ink no-underline hover:border-ink";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-10 sm:pt-14">
        <article data-expires={n.expires} data-expired-redirect className="mx-auto grid max-w-[1000px] gap-10 md:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <Link href="/nuggets" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-grey no-underline hover:text-ink">
              <Icon name="arrow" className="size-4 rotate-180" /> All daily nuggets
            </Link>
            <p className="mb-3 flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-grey">
              <span className="rounded-full bg-yellow px-2.5 py-1 text-ink">Daily Nugget</span>
              <span className="rounded-full border border-line-strong px-2.5 py-1">{n.category}</span>
              <time dateTime={n.date}>{formatDate(n.date)}</time>
            </p>
            <h1 className="mb-4 font-display text-[clamp(30px,4.6vw,44px)] font-black leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance]">
              {n.title}
            </h1>
            <p className="mb-6 border-b border-line pb-6 text-[17px] leading-relaxed text-grey">{n.summary}</p>
            <div className="prose prose-lg prose-brand max-w-none" dangerouslySetInnerHTML={{ __html: n.html }} />
            {n.source && (
              <p className="mt-6 text-sm text-grey">
                Source:{" "}
                <a href={n.source} target="_blank" rel="noopener" className="font-bold text-ink underline decoration-yellow-deep decoration-2 underline-offset-4">
                  {n.sourceLabel ?? "YouTube Help"}
                </a>
              </p>
            )}
          </div>

          <aside className="md:pt-12">
            {n.feedImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={n.feedImage} alt={n.title} width={1080} height={1350} className="mb-5 h-auto w-full rounded-2xl shadow-[0_20px_40px_-24px_rgba(11,11,12,0.6)]" />
            )}
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink">Share this nugget</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {share.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className={btn}>
                  {s.label}
                </a>
              ))}
            </div>
            {(n.feedImage || n.storyImage) && (
              <>
                <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink">Download the image</p>
                <div className="flex flex-wrap gap-2">
                  {n.feedImage && (
                    <a href={n.feedImage} download className={btn}>
                      Post (4:5)
                    </a>
                  )}
                  {n.storyImage && (
                    <a href={n.storyImage} download className={btn}>
                      Story / Status (9:16)
                    </a>
                  )}
                </div>
              </>
            )}
          </aside>
        </article>

        {others.length > 0 && (
          <section className="mx-auto mt-14 max-w-[1000px] border-t border-line pt-8">
            <h2 className="mb-4 font-display text-xl font-black text-ink">More nuggets</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {others.map((o) => (
                <li key={o.slug} data-expires={o.expires}>
                  <Link href={`/nuggets/${o.slug}`} className="font-bold text-ink underline decoration-yellow-deep decoration-2 underline-offset-4 hover:bg-yellow-soft">
                    {o.title}
                  </Link>{" "}
                  <span className="text-sm text-grey">· {formatDate(o.date)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <script dangerouslySetInnerHTML={{ __html: EXPIRY_SCRIPT }} />
        <div className="mx-auto max-w-[960px]">
          <CTABlock pkg="watchHours" lead="Want help getting monetized before Feb 1, 2027?" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
