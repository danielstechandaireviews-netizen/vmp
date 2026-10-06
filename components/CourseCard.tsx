import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatNaira, KIND_LABEL, type CourseMeta } from "@/lib/courses";

export function CourseCard({ course }: { course: CourseMeta }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line-strong bg-paper transition-[border-color,box-shadow] hover:border-ink hover:shadow-[0_14px_30px_-18px_rgba(11,11,12,0.45)]">
      <Link href={`/courses/${course.slug}`} className="block overflow-hidden bg-ink" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image}
          alt=""
          width={1774}
          height={887}
          loading="lazy"
          className="block aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className={`self-start rounded-full px-2.5 py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.08em] ${course.kind === "service" ? "bg-ink text-yellow" : "bg-yellow text-ink"}`}>
          {KIND_LABEL[course.kind]}
        </span>
        <h3 className="m-0 line-clamp-3 text-[16.5px] font-extrabold leading-snug text-ink">
          <Link href={`/courses/${course.slug}`} className="text-ink no-underline hover:underline hover:decoration-yellow-deep hover:decoration-2 hover:underline-offset-4">
            {course.title}
          </Link>
        </h3>
        <p className="m-0 line-clamp-3 flex-1 text-[13.5px] leading-normal text-grey">{course.summary}</p>
        <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
          <span className="font-num text-[22px] font-black tracking-[-0.02em] text-ink tabular">{formatNaira(course.priceNGN)}</span>
          <Link href={`/courses/${course.slug}`} className="text-[13px] font-extrabold text-grey no-underline hover:text-ink">
            Details
          </Link>
        </div>
        <a
          href={course.selfany}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-yellow px-4 py-3 text-[14px] font-extrabold text-ink no-underline hover:bg-yellow-deep"
        >
          Buy on Selfany <Icon name="arrow" className="size-4" />
        </a>
      </div>
    </article>
  );
}
