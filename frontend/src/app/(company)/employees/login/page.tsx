import InviteVerifier from "./InviteVerifier";

type Props = {
  searchParams: {
    token?: string;
  };
};

export default function LoginPage({ searchParams }: Props) {
  const token = searchParams?.token;

  if (token) {
    // 🔐 Invite verification flow
    return <InviteVerifier token={token} />;
  }

  // 🔑 Normal login page
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-semibold">Login</h1>
      {/* your normal email + password login form */}
    </div>
  );
}
