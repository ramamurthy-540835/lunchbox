import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageFooter, ContentPageHeader } from "@/components/ContentPageChrome";

export const metadata: Metadata = {
  title: "Our Promise | LunchBox",
  description: "How LunchBox works with schools and families to make school lunch ordering easier.",
};

const promises = [
  { icon: "▣", title: "Trusted by Schools", description: "Partnered with verified schools across Tamil Nadu." },
  { icon: "◷", title: "Reliable Daily Delivery", description: "Lunches arrive on time every school day." },
  { icon: "◎", title: "Easy Parent Ordering", description: "Order, manage, and track in a few taps." },
  { icon: "♥", title: "Healthy Kids", description: "Clear nutrition and quality standards for parents." },
];

export default function OurPromisePage() {
  return <main className="content-page">
    <ContentPageHeader />
    <section className="content-page-hero promise-page-hero">
      <span className="kicker">OUR PROMISE</span>
      <h1>Thoughtful school lunches, made easier for families.</h1>
      <p>LunchBox brings school partnerships, parent ordering, and clear meal information together in one place.</p>
      <Link className="primary-button" href="/#menu">Order lunch <span aria-hidden="true">→</span></Link>
      <div className="promise-page-art" aria-hidden="true"><span>🍱</span><i>🥗</i><b>🥭</b></div>
    </section>
    <section className="promise-details" aria-label="LunchBox service commitments">
      {promises.map((promise) => <article key={promise.title}>
        <span aria-hidden="true">{promise.icon}</span><h2>{promise.title}</h2><p>{promise.description}</p>
      </article>)}
    </section>
    <section className="content-page-cta"><h2>Ready to choose a lunch?</h2><p>See the current menu and available meal plans.</p><Link className="primary-button" href="/#menu">Explore the menu <span aria-hidden="true">→</span></Link></section>
    <ContentPageFooter />
  </main>;
}
