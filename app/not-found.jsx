import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap-wide">
        <p className="mono eyebrow">ERROR 404</p>
        <h1 className="display">
          This page doesn&rsquo;t <em>compute.</em>
        </h1>
        <p className="lede">The page you&rsquo;re looking for has moved or never existed.</p>
        <Link href="/" className="btn btn-signal btn-lg">
          Back to home <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
