"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

//search params nos lo da automaticamente NEXTJS en pages
//https://nextjs.org/docs/app/api-reference/file-conventions/page
export default function Payment({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // useSearchParams(); -> esto en componentes o sitios que no son page

  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();

  const router = useRouter();

  // Así deberia funcionar, pero en la version actual de nextAuth no rula
  // useEffect(() => {
  //   if (searchParams.success) {
  //     update();
  //   }
  // }, [searchParams.success]);

  return (
    <main className="flex flex-col items-center gap-4">
      <H1>Petsoft access requires payment</H1>

      {searchParams.success && (
        <Button
          disabled={status === "loading" || session?.user.hasAccess}
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access Petsoft
        </Button>
      )}

      {/* Se podria crear un boton componente a parte para no hacer la pagina use client */}
      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-600">
          Payment successful! You now have lifetime access to Petsoft.
        </p>
      )}

      {searchParams.cancelled && (
        <p className="text-sm text-red-600">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
