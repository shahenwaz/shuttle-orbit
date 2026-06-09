import { redirect } from "next/navigation";

type ClubMembersPageProps = {
  params: Promise<{
    clubId: string;
  }>;
};

export default async function ClubMembersPage({
  params,
}: ClubMembersPageProps) {
  const { clubId } = await params;

  redirect(`/admin/clubs/${clubId}`);
}
