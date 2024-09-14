import { useUser } from "@clerk/nextjs";
import { Roles } from "~/types/globals";

export const UseCheckRole = (role: Roles) => {
  const user = useUser();
  const publicMetadata = user?.user?.publicMetadata.role ?? "";

  console.log("TEST", publicMetadata);
  return publicMetadata === role;
};
// "use server";
// import { useAuth, useUser } from "@clerk/nextjs";
// import { api } from "~/trpc/server";
// import { Roles } from "~/types/globals";

// export async function UseCheckRole(role: Roles) {
//   const user = useUser().user?.id;
//   const usuario = await api.clerk.getUserbyId({ id: user ?? "" });

//   if (usuario.data.find((u) => u.id === user)?.publicMetadata.role === role)
//     return true;
//   else {
//     return false;
//   }
// }
