import { renderOg } from "@/lib/og";
import { tutor } from "@/lib/site";

export const alt = `${tutor.name}: ${tutor.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function AboutOpenGraphImage() {
  return renderOg({
    line1: "Engineer by training.",
    line2: "Teacher by instinct.",
    footerLeft: `${tutor.name} · ${tutor.role}`,
    footerRight: "Perth & online worldwide",
  });
}
