import AnimatedButton from "@/components/ui/animated-button";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { ScrollInvitation } from "@/components/scroll-invitation";
import { demoAction } from "@/lib/navigation";

export function CinematicHero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading" data-header-stick>
      <div className="hero-main shell">
        <div className="hero-copy">
          <TextEffect as="h1" id="hero-heading" per="char" preset="fade-in-blur" emphasis="better">
            {"Make your company\nbetter at getting better."}
          </TextEffect>
          <AnimatedButton as="a" data-arrive="action" href={demoAction.href} target="_blank" rel="noreferrer">
            {demoAction.label} <ArrowUpRight />
          </AnimatedButton>
        </div>
      </div>
      <div className="hero-scroll shell" data-arrive="description">
        <ScrollInvitation />
      </div>
    </section>
  );
}
