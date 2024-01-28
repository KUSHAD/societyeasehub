import ClientOnly from "~/components/ClientOnly";
import AuthButtons from "~/components/auth/AuthButtons";
import AuthError from "~/components/auth/AuthError";

export default function Page() {
  return (
    <>
      <ClientOnly>
        <AuthError />
        <AuthButtons />
      </ClientOnly>
    </>
  );
}
