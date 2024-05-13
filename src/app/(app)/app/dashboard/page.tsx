import Branding from "@/components/branding";
import H1 from "@/components/h1";
import Stats from "@/components/stats";

export default function Dashboard() {
  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <Branding />

        <Stats />
      </div>
    </main>
  );
}
