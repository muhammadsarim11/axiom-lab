import { renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: Maths, Physics & Chemistry tutoring, Years 7–12`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOg({
    line1: "From confusion",
    line2: "to confidence.",
    footerLeft: "Maths · Physics · Chemistry · Years 7–12",
    footerRight: "Perth & online worldwide",
  });
}
