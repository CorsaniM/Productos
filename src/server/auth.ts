import { auth, currentUser } from "@clerk/nextjs/server";

export const getServerAuthSession = () => {
  const { userId, ...session } = auth();

  if (!userId) {
    return null;
  }
  return {
    ...session,
    user: {
      id: userId,
    },
  };
};

export const getServerAuthUser = () => {
  return currentUser();
};
