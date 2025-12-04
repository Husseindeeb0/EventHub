import EventDetailsClientWrapper from "./ClientWrapper";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EventDetailsClientWrapper>{children}</EventDetailsClientWrapper>;
}
