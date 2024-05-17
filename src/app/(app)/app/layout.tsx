import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { checkAuth, getPetsByUserId } from "@/lib/server-utils";

type AppLayout = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayout) {
  const session = await checkAuth();
  const pets = await getPetsByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />
        <PetContextProvider data={pets}>
          <SearchContextProvider>{children}</SearchContextProvider>
        </PetContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
