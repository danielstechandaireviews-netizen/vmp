import { SOCIAL_LINKS, type SocialLink } from "@/lib/social";

// Simple line icons in the site's style (not the official logos).
const ICONS: Record<SocialLink["icon"], React.ReactNode> = {
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.2v5.6l4.8-2.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" strokeWidth="2.6" />
    </>
  ),
  x: <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />,
  tiktok: <path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8M14 3.5c.4 2.6 2.2 4.4 5 4.6" />,
};

export function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mr-1 text-[13px] font-bold text-[#9a9aa2]">Follow us</span>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener me"
          aria-label={s.label}
          title={s.name}
          className="flex size-10 items-center justify-center rounded-full border border-ink-3 bg-ink-2 text-[#ececf0] transition-colors hover:border-yellow hover:bg-yellow hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[s.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}
