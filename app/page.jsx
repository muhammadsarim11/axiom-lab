import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import Approach from "@/components/sections/Approach";
import Subjects from "@/components/sections/Subjects";
import ExamPrep from "@/components/sections/ExamPrep";
import Pricing from "@/components/sections/Pricing";
import Resources from "@/components/sections/Resources";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Booking from "@/components/sections/Booking";
import { faqSchema, organizationSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema()} />
      <Hero />
      <Marquee />
      <Approach />
      <Subjects />
      <ExamPrep />
      <Pricing />
      <Resources />
      <Testimonials />
      <Faq />
      <Booking />
    </>
  );
}
