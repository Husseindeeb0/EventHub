import NormalUserWrapper from "./NormalUserWrapper";

export default function NormalUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NormalUserWrapper>{children}</NormalUserWrapper>;
}
