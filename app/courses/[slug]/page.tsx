import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { Icon } from "@/components/Icon";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { toolMetadata } from "@/components/ToolLayout";
import { formatNaira, getAllCourses, getCourse, KIND_LABEL } from "@/lib/courses";
import { SITE_URL } from "@/lib/packages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const course = getCourse((await params).slug);
  if (!course) return {};
  const meta = toolMetadata({ title: `${course.title} | ViralMoniPoint`, description: course.summary, path: `/courses/${course.slug}` });
  return { ...meta, openGraph: { ...meta.openGraph, images: [course.image] } };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  const more = getAllCourses().filter((c) => c.slug !== course.slug && c.kind === course.kind).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": course.kind === "course" ? "Course" : "Service",
    name: course.title,
    description: course.summary,
    image: `${SITE_URL}${course.image}`,
    provider: { "@type": "Organization", name: "ViralMoniPoint", url: SITE_URL },
    offers: { "@type": "Offer", price: course.priceNGN, priceCurrency: "NGN", url: course.selfany, availability: "https://schema.org/InStock" },
  };

  const BuyButton = ({ full = false }: { full?: boolean }) => (
    <a
      href={course.selfany}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] bg-yellow px-5 py-3.5 text-[15px] font-extrabold text-ink no-underline hover:bg-yellow-deep ${full ? "w-full" : ""}`}
    >
      Buy on Selfany <Icon name="arrow" className="size-4" />
    </a>
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1120px] px-5 pb-20 pt-10 sm:pt-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Link href="/courses" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-grey no-underline hover:text-ink">
          <Icon name="arrow" className="size-4 rotate-180" /> All courses & services
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article>
            <span className={`mb-4 inline-block rounded-full px-2.5 py-1 font-display text-[10.5px] font-extrabold uppercase tracking-[0.08em] ${course.kind === "service" ? "bg-ink text-yellow" : "bg-yellow text-ink"}`}>
              {KIND_LABEL[course.kind]}
            </span>
            <h1 className="mb-6 font-display text-[clamp(28px,4.2vw,42px)] font-black leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance]">
              {course.title}
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.image} alt={course.title} width={1774} height={887} className="mb-8 block aspect-[2/1] w-full rounded-card object-cover" />
            <div className="prose prose-lg prose-brand max-w-none" dangerouslySetInnerHTML={{ __html: course.html }} />
            <div className="mt-8 lg:hidden">
              <BuyButton full />
            </div>
          </article>

          <aside className="relative overflow-hidden rounded-card bg-ink p-6 text-white after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 after:bg-yellow lg:sticky lg:top-24">
            <p className="m-0 font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9a9aa2]">Price</p>
            <p className="mb-1 mt-1 font-num text-[40px] font-black leading-none tracking-[-0.03em] text-yellow tabular">{formatNaira(course.priceNGN)}</p>
            <p className="mb-5 text-[13px] text-[#9a9aa2]">Choose your currency at checkout</p>
            <BuyButton full />
            <ul className="mb-1 mt-5 flex list-none flex-col gap-2.5 p-0 text-[13.5px] text-[#ececf0]">
              <li className="flex gap-2"><span className="text-yellow">✓</span> Secure checkout on our Selfany store</li>
              <li className="flex gap-2"><span className="text-yellow">✓</span> 100+ payment methods</li>
              <li className="flex gap-2"><span className="text-yellow">✓</span> {course.kind === "course" ? "Instant access after payment" : "We'll be in touch to get started"}</li>
            </ul>
          </aside>
        </div>

        {more.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-2xl font-black tracking-[-0.02em] text-ink">
              {course.kind === "course" ? "More courses" : "More services"}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
