import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { demoAction, navigationItems } from "@/lib/navigation";

export function SiteFooter({ topHref }: { topHref: string }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-identity">
          <Link className="footer-brand" href="/#top">
            <span className="brand-mark"><Image src="/brand-mark.svg" alt="" width={29} height={25} /></span>
            Afterflow
          </Link>
          <p>Make your company<br />better at getting better.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navigationItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href="/#trust">Trust &amp; governance</Link>
        </nav>
        <div className="footer-contact">
          <p>Every improvement starts with a conversation.</p>
          <a className="text-link" href={demoAction.href} target="_blank" rel="noreferrer">
            {demoAction.label} <ArrowUpRight />
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <small>© 2026 Afterflow Inc.</small>
        <a href={topHref}>Back to top <svg viewBox="0 0 12 16" fill="none" aria-hidden="true"><path d="M6 15V1m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="1" /></svg></a>
      </div>
    </footer>
  );
}
