import { Pet } from "@/lib/types";
import Image from "next/image";

type PetListProps = {
  pets: Pet[];
};

export default function PetList({ pets }: PetListProps) {
  return (
    <ul className=" bg-white border-b border-b-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className=" rounded-full object-cover"
            />
            <p className=" font-semibold">Benjamin</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
