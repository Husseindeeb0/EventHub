import ProfileClientWrapper from "../../../components/profile/ClientWrapper";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileClientWrapper>{children}</ProfileClientWrapper>;
}
