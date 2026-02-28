import InviteVerifier from "../verification/InviteVerifier";

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (token) {
    return <InviteVerifier token={token} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-semibold">Login</h1>
      {/* email + password login form */}
    </div>
  );
}
