export default function V2ModeNotice() {
  if (process.env.NEXT_PUBLIC_LUNCHBOX_ENV !== "v2") return null;
  return <aside className="v2-mode-notice" role="status">
    LunchBox V2 development environment. Orders use isolated test data; payment capture is disabled and no food delivery is scheduled.
  </aside>;
}
