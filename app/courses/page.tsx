import { CourseCard } from "@/components/CourseCard";
import { ToolLayout, toolMetadata } from "@/components/ToolLayout";
import { getAllCourses, STORE_URL } from "@/lib/courses";

export const metadata = toolMetadata({
  title: "YouTube Growth Courses & Done-for-You Services | ViralMoniPoint",
  description:
    "Courses on faceless channels, subscriber growth, AI automation and building with AI, plus done-for-you YouTube monetization services from ViralMoniPoint.",
  path: "/courses",
});

export default function CoursesPage() {
  const all = getAllCourses();
  const courses = all.filter((c) => c.kind === "course");
  const services = all.filter((c) => c.kind === "service");

  return (
    <ToolLayout
      h1="Courses & Services"
      eyebrow="Learn & grow"
      backLink={false}
      trustNote={false}
      intro="Learn to grow and monetize your channel yourself, or hand it to us. Checkout is handled securely by our store on Selfany."
    >
      <section className="mb-14">
        <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="m-0 font-display text-[clamp(22px,3vw,28px)] font-black tracking-[-0.02em] text-ink">Online courses</h2>
          <span className="whitespace-nowrap text-sm font-bold text-grey tabular">{courses.length} courses</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {services.length > 0 && (
        <section className="mb-10">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h2 className="m-0 font-display text-[clamp(22px,3vw,28px)] font-black tracking-[-0.02em] text-ink">Done-for-you services</h2>
            <span className="whitespace-nowrap text-sm font-bold text-grey tabular">{services.length} services</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      )}

      <p className="m-0 rounded-2xl bg-paper-2 p-5 text-sm leading-relaxed text-grey">
        Prices are listed in Naira (₦), as on our store. You can choose your currency and pay with 100+ payment methods at
        checkout on{" "}
        <a href={STORE_URL} target="_blank" rel="noopener" className="font-bold text-ink underline decoration-yellow-deep decoration-2 underline-offset-4">
          viralmonipoint.selfany.com
        </a>
        .
      </p>
    </ToolLayout>
  );
}
