// ViralMoniPoint's social channels. Also hard-coded in the footers of
// public/index.html and public/partners.html — keep them in sync.
export type SocialLink = { name: string; label: string; href: string; icon: "youtube" | "instagram" | "x" | "tiktok" };

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "YouTube", label: "ViralMoniPoint on YouTube", href: "https://www.youtube.com/@ViralMoniPoint", icon: "youtube" },
  { name: "Instagram", label: "ViralMoniPoint on Instagram", href: "https://www.instagram.com/ViralMoniPoint", icon: "instagram" },
  { name: "X", label: "ViralMoniPoint on X (Twitter)", href: "https://x.com/ViralMoniPoint", icon: "x" },
  { name: "TikTok", label: "ViralMoniPoint on TikTok", href: "https://www.tiktok.com/@ViralMoniPoint", icon: "tiktok" },
];
