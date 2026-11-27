import Link from "next/link";
import { CTABlock } from "@/components/CTABlock";
import { Icon } from "@/components/Icon";
import { ToolLayout, toolMetadata } from "@/components/ToolLayout";
import { formatDate } from "@/lib/blog";
import { EXPIRY_SCRIPT, getActiveNuggets, NUGGET_DAYS } from "@/lib/nuggets";

export const metadata = toolMetadata({
  title: "YouTube Daily Nuggets: Policy & Requirement Updates | ViralMoniPoint",
  description:
    "A new YouTube nugget every day: policy changes, monetization requirement updates and rules for channel success, explained in plain English by ViralMoniPoint.",
  path: "/nuggets",
});

export default function NuggetsIndex() {
  const nuggets = getActiveNuggets();
  const [latest, ...rest] = nuggets;
  return (
    <ToolLayout
      h1="YouTube Daily Nuggets"
      eyebrow="Daily Nuggets"
      backLink={false}
      trustNote={false}
      intro={
        <>
          One short YouTube update every day: new policies, changing monetization requirements and the habits that grow channels.
          Each nugget stays up for {NUGGET_DAYS} days, so check back daily.
        </>
      }
    >
      {!latest ? (
        <p className="text-grey">Today&apos;s nugget is on the way.</p>
      ) : (
        <>
          <article data-expires={latest.expires} className="mb-10 grid items-center gap-8 rounded-card border border-line-strong bg-paper p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="mb-3 flex flex-wrap items-center gap-2 text-[12.5px] font-bold text-grey">
                <span className="rounded-full bg-yellow px-2.5 py-1 text-ink">Latest nugget</span>
                <span className="rounded-full border border-line-strong px-2.5 py-1">{latest.category}</span>
                <time dateTime={latest.date}>{formatDate(latest.date)}</time>
              </p>
              <h2 className="mb-3 font-display text-[clamp(24px,3.4vw,34px)] font-black leading-tight tracking-[-0.02em] text-ink [text-wrap:balance]">
                {latest.title}
              </h2>
              <p className="mb-5 text-[16px] leading-relaxed text-grey">{latest.summary}</p>
              <Link
                href={`/nuggets/${latest.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-white no-underline hover:bg-black"
              >
                Read &amp; share <Icon name="arrow" className="size-4" />
              </Link>
            </div>
            {latest.feedImage && (
              <Link href={`/nuggets/${latest.slug}`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={latest.feedImage} alt={latest.title} width={1080} height={1350} className="h-auto w-full rounded-2xl shadow-[0_20px_40px_-24px_rgba(11,11,12,0.6)]" />
              </Link>
            )}
          </article>

          {rest.length > 0 && (
            <>
              <h2 className="mb-4 font-display text-xl font-black text-ink">Earlier nuggets</h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((n) => (
                  <Link
                    key={n.slug}
                    data-expires={n.expires}
                    href={`/nuggets/${n.slug}`}
                    className="group flex flex-col rounded-card border border-line-strong bg-paper p-6 no-underline transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink"
                  >
                    <p className="mb-3 text-[12.5px] font-bold text-grey">
                      {formatDate(n.date)} · {n.category}
                    </p>
                    <h3 className="mb-2 font-display text-[18px] font-black leading-snug text-ink">{n.title}</h3>
                    <p className="flex-1 text-[14.5px] leading-relaxed text-grey">{n.summary}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <script dangerouslySetInnerHTML={{ __html: EXPIRY_SCRIPT }} />
      <CTABlock pkg="watchHours" lead="Want a channel plan built around these rules?" />
    </ToolLayout>
  );
}
