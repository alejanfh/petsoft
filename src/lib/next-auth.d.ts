import { User } from "next-auth";

// d. -> declaration type
// No gustan los types que tienen los node modules de next-auth y
// se crea esto para overrite the types

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}
