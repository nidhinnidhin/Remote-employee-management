export default function InviteInvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Invalid Invitation</h1>
        <p className="text-neutral-500">
          This invitation link has expired or already been used.
        </p>
      </div>
    </div>
  );
}
