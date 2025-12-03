import OrganizerWrapper from "./OrganizerWrapper";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizerWrapper>{children}</OrganizerWrapper>;
}
