import { SessionProvider } from "next-auth/react";

function Cabinet() {
  return (
    <div>
      <div></div>
    </div>
  );
}

export default function CabinetWhrapper() {
  return (
    <SessionProvider>
      <Cabinet />
    </SessionProvider>
  );
}
