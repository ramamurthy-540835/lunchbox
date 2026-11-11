import Link from "next/link";
import PrimaryMenu from "@/components/PrimaryMenu";

export function ContentPageHeader() {
  return <header className="topbar content-topbar">
    <Link className="brand" href="/" aria-label="LunchBox home"><span className="brand-mark">L</span><span>Lunch<span>Box</span></span></Link>
    <PrimaryMenu />
    <Link className="content-header-order" href="/#menu">Order lunch</Link>
  </header>;
}

export function ContentPageFooter() {
  return <footer className="content-footer">
    <Link className="brand" href="/"><span className="brand-mark">L</span><span>Lunch<span>Box</span></span></Link>
    <p>Made with care for growing minds in Tamil Nadu.</p>
    <Link href="/#menu">Explore the food menu</Link>
  </footer>;
}
