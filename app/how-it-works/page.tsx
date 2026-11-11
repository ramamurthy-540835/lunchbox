import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageFooter, ContentPageHeader } from "@/components/ContentPageChrome";

export const metadata: Metadata = {
  title: "How It Works | LunchBox",
  description: "Follow the LunchBox school lunch ordering process from school selection through checkout.",
};

const steps = [
  ["01", "Select a city", "Choose a city listed in the current meal catalogue."],
  ["02", "Choose an eligible school", "Select a school that is available for LunchBox ordering."],
  ["03", "Choose the student or meal category", "Select the appropriate grade band or meal category for the order."],
  ["04", "Pick a lunch", "Review the current menu and add the lunch you want."],
  ["05", "Add it to your bag", "Check meal quantities and the displayed total before continuing."],
  ["06", "Complete checkout", "Confirm the student details. Parent phone verification and saved student profiles are used when configured."],
  ["07", "School-based delivery", "The order details are routed to the selected school for its supported lunch delivery process."],
] as const;

export default function HowItWorksPage() {
  return <main className="content-page">
    <ContentPageHeader />
    <section className="content-page-hero how-page-hero">
      <span className="kicker">HOW IT WORKS</span>
      <h1>From menu to school, one clear step at a time.</h1>
      <p>Use the ordering flow supported by the current LunchBox application.</p>
      <Link className="primary-button" href="/#menu">Start with the menu <span aria-hidden="true">→</span></Link>
    </section>
    <ol className="how-steps">
      {steps.map(([number, title, description]) => <li key={number}><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></li>)}
    </ol>
    <section className="content-page-cta"><h2>Choose a meal for your school</h2><p>The menu shows currently available meals and prices.</p><Link className="primary-button" href="/#menu">Order lunch <span aria-hidden="true">→</span></Link></section>
    <ContentPageFooter />
  </main>;
}
