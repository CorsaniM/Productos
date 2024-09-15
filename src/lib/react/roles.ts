"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Roles } from "~/types/globals";

export function useCheckRole(role: Roles) {
  const { user } = useUser();
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.publicMetadata) {
      setHasRole(user?.publicMetadata.role === role);
    }
  }, [role, user, hasRole]);

  return { hasRole };
  // const {
  //   data: usuario,
  //   isLoading,
  //   error,
  // } = api.clerk.getUserbyId.useQuery(
  //   { id: user?.id ?? "" },
  //   { enabled: !!user },
  // );

  // useEffect(() => {
  //   if (!isLoading && usuario) {
  //     const userRole = usuario.publicMetadata?.role;
  //     console.log("TEST", userRole);

  //   }
  // }, [isLoading, usuario, role, user]);
}
