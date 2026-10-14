import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Motion from "@/components/Motion";
import MotionNotice from "@/components/MotionNotice";
import ScrollProgress from "@/components/ScrollProgress";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { respectReducedMotion, site } from "@/lib/site";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = `${site.name} | Maths, Physics & Chemistry Tutor in Perth & Online (Years 7–12)`;

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Perth maths tutor",
    "Perth physics tutor",
    "Perth chemistry tutor",
    "online maths tutor Australia",
    "online physics tutor",
    "online chemistry tutor",
    "Year 7 to Year 12 tutoring",
    "Year 12 ATAR tutor",
    "engineer tutor",
    "STEM tuition Perth",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
    url: "/",
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  category: "education",
};

export const viewport = {
  themeColor: "#0d1411",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: opt in to motion unless the visitor's device asks for reduced motion
// (see respectReducedMotion in lib/site.js). Those visitors see a one-click "Turn on animations"
// notice; the choice is remembered in localStorage. "?motion=on" / "?motion=off" set or clear it.
// If the animation layer never reports ready (e.g. a script error), content is shown anyway.
const motionGate = `(function(){var d=document.documentElement,q=location.search,st=null;try{st=window.localStorage}catch(e){}try{if(st){if(/[?&]motion=on(&|$)/.test(q))st.setItem('motion','on');if(/[?&]motion=off(&|$)/.test(q))st.removeItem('motion')}}catch(e){}var reduce=false;try{reduce=${respectReducedMotion}&&window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!(st&&st.getItem('motion')==='on')}catch(e){}if(!reduce){d.classList.add('has-motion');setTimeout(function(){if(!d.dataset.motion)d.classList.remove('has-motion')},4500)}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-AU"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
        <noscript>
          <style>{`.has-motion [data-reveal],.has-motion [data-reveal-group]>*,.has-motion [data-split],.has-motion [data-scrub],.has-motion [data-hero-line],.has-motion [data-hero-fade]{opacity:1!important;visibility:visible!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <ScrollProgress />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <Motion />
        <MotionNotice />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
