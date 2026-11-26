import { createPublicClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { Video } from "lucide-react";
import { Product } from "@/types";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { hasSupabasePreview } from "@/lib/product-preview";
import { PublicReview } from "@/lib/reviews-data";
import ScrollFX from "@/components/motion/ScrollFx";
import SectionContent from "@/components/motion/SectionContent";
import ScrollSlideX from "@/components/motion/ScrollSlideX";
import ScrollFlipSection from "@/components/motion/ScrollFlipSection";
import ScrollSlideLeftToRight from "@/components/motion/ScrollSlideLeftToRight";
import ScrollSlideBottomToTop from "@/components/motion/ScrollSlideBottomToTop";
import HeroVedio from "@/components/HeroVedio";
import ProcessPreviewVideo from "@/components/ProcessPreviewVideo";

const PerspectiveCarousel = dynamic(
  () => import("@/components/product/PerspectiveCarousel"),
);
const CommissionsCTA = dynamic(
  () => import("@/components/cta/CommissionsCTA"),
);
const ReviewsShowcase = dynamic(
  () => import("@/components/reviews/ReviewsShowcase"),
);

export const revalidate = 60;

async function getHomeData() {
  if (!hasSupabaseConfig()) {
    return { featured: [] as Product[], reviews: [] as PublicReview[] };
  }

  // Public storefront reads should use the publishable/anon client.
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, image_url, model_url, product_images(*), product_attributes(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    return { featured: [] as Product[], reviews: [] as PublicReview[] };
  }

  const pool = (data || []) as unknown as Product[];
  const supaFeatured = pool.filter((p) => hasSupabasePreview(p as any));

  return {
    featured: supaFeatured.length > 0 ? supaFeatured : pool,
    reviews: [] as PublicReview[],
  };
}

export default async function HomePage() {
  const { featured, reviews } = await getHomeData();

  const craftPoints = [
    {
      iconName: "Layers",
      title: "Micron-Level Layer Resolution",
      desc: "Ultra-crisp detail retention even on intricate anime facial features.",
    },
    {
      iconName: "Sparkles",
      title: "Hand-Painted Finishing",
      desc: "Custom shade palettes, airbrushing, and protective matte or glossy coats.",
    },
  ];

  const process = [
    {
      iconName: "Compass",
      title: "Discover",
      desc: "Browse the collection, or share a reference for a piece that doesn’t exist yet",
    },
    {
      iconName: "MessageCircle",
      title: "Consult",
      desc: "We talk through scale, finish, and detail together before anything is made",
    },
    {
      iconName: "Palette",
      title: "Create",
      desc: "Your piece is sculpted, cast, and hand-painted in the atelier",
    },
    {
      iconName: "Shield",
      title: "Deliver",
      desc: "Each piece is inspected under studio light before it leaves us",
    },
  ];

  return (
    <div className="relative bg-background overflow-x-clip">
      {/* Scroll FX progress bar */}
      <ScrollFX />

      {/* ═══════════════════════════════════════════════════════
          HERO — scroll-scrubbing car frame sequence
      ═══════════════════════════════════════════════════════ */}
      <HeroVedio />

      {/*
        All section animations below use SectionContent (a client component
        that wraps framer-motion). The parent <section> layout is NEVER touched.
        Only the inner glass cards, text groups, and grids are animated.
      */}

      {/* ═══════════════════════════════════════════════════════
          SCROLL-SCRUBBED 3D FLIP: GALLERY ➔ CRAFTSMANSHIP
      ═══════════════════════════════════════════════════════ */}
      <ScrollFlipSection
        galleryContent={
          <ScrollSlideX>
            <section id="gallery" className="py-10">
              <SectionContent
                eyebrow="Selected Works"
                heading="From the Collection"
                subtext="Each piece shown here is available to view in 3D, or to enquire about as a one-of-one commission."
              >
                {featured.length > 0 && (
                  <div className="mx-auto w-full min-w-0">
                    <PerspectiveCarousel products={featured} />
                  </div>
                )}
              </SectionContent>
            </section>
          </ScrollSlideX>
        }
        craftsmanshipContent={
          <section className="py-10 w-full">
            <div className="max-w-7xl mx-auto px-4">
              
                <SectionContent
                  eyebrow="Craftsmanship"
                  heading="From Digital Sculpts to Physical Masterpieces"
                  subtext="Every model is meticulously cured, sanded, primed, and hand-painted by our artisans — transforming a digital sculpt into a durable, museum-grade work you can hold."
                  twoCol
                  leftContent={
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
                      <ProcessPreviewVideo src="/process-preview.mp4" />
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-2 text-zinc-300">
                        <Video className="w-4 h-4 text-zinc-400" /> Inside the
                        Atelier
                      </div>
                    </div>
                  }
                  craftPoints={craftPoints}
                />
              
            </div>
          </section>
        }
      />

      {/* CTA  */}
      <ScrollSlideLeftToRight>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <CommissionsCTA />
          </div>
        </section>
      </ScrollSlideLeftToRight>

      {/* ═══════════════════════════════════════════════════════
          REVIEWS
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideBottomToTop>
        <section className="py-16 flex justify-center">
          <div className="max-w-7xl">
            <SectionContent
              eyebrow="Collector Feedback"
              heading="Verified Collector Reviews"
              subtext="See what our collectors say on Google Reviews"
            >
              <ReviewsShowcase reviews={reviews as PublicReview[]} compact />
            </SectionContent>
          </div>
        </section>
      </ScrollSlideBottomToTop>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideBottomToTop>
        <section className="max-w-7xl mx-auto px-4 py-20">
          <SectionContent
            eyebrow="How It Works"
            heading="The Commissioning Process"
            processSteps={process}
          />
        </section>
      </ScrollSlideBottomToTop>
    </div>
  );
}
