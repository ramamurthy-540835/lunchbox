"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const groups = [
  { title: "Food and ordering", links: [
    ["Food menu", "/#menu"], ["Lunch plans", "/#plans"], ["Pricing", "/#pricing"], ["Order lunch", "/#menu"],
  ] },
  { title: "About LunchBox", links: [
    ["Our promise", "/our-promise"], ["How it works", "/how-it-works"], ["Service locations", "/#service-locations"],
  ] },
  { title: "Registration", links: [
    ["Parent registration", "/register"], ["School student registration", "/schools/register"],
    ["College student registration", "/register/college"], ["Office employee registration", "/register/office-company"],
  ] },
  { title: "Business and support", links: [
    ["Franchise", "/franchise"], ["Partner network", "/#franchises"],
  ] },
] as const;

export default function PrimaryMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !menuRef.current?.open) return;
      menuRef.current.open = false;
      menuRef.current.querySelector("summary")?.focus();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return <details className="primary-menu" ref={menuRef}>
    <summary aria-controls="primary-menu-panel">Menu</summary>
    <div className="mega-menu" id="primary-menu-panel">
      {groups.map((group) => <section key={group.title} aria-label={group.title}>
        <h2>{group.title}</h2>
        {group.links.map(([label, href]) => <Link href={href} key={label} onClick={() => { if (menuRef.current) menuRef.current.open = false; }}>{label}</Link>)}
      </section>)}
      <p className="menu-support-note">For order changes, contact your school coordinator.</p>
    </div>
  </details>;
}
