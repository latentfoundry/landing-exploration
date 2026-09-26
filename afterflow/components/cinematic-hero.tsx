import AnimatedButton from "@/components/ui/animated-button";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { CascadeText } from "@/components/ui/cascade-text";
import { ScrollInvitation } from "@/components/scroll-invitation";
import { demoAction } from "@/lib/navigation";

export function CinematicHero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading" data-header-stick>
      <div className="hero-main shell">
        <h1 id="hero-heading" aria-label="Make your company better at getting better.">
          <span className="hero-line"><CascadeText text="Make your company" /></span>
          <span className="hero-line"><em><CascadeText text="better" offset={15} /></em>{" "}<CascadeText text="at getting better." offset={21} /></span>
        </h1>
        <AnimatedButton as="a" data-arrive="action" href={demoAction.href} target="_blank" rel="noreferrer">
          {demoAction.label} <ArrowUpRight />
        </AnimatedButton>
      </div>
      <div className="hero-scroll" data-arrive="description">
        <ScrollInvitation />
      </div>
    </section>
  );
}
