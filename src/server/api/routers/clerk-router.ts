import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const clerkRouter = createTRPCRouter({
  getUserbyId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = (await clerkClient.users.getUserList()).data.find(
          (x) => x.id === input.id,
        );
        return response;
      } catch (e) {
        throw new Error("Error fetching user by ID");
      }
    }),
  list: protectedProcedure.query(async () => {
    try {
      const response = await clerkClient.users.getUserList();
      return response;
    } catch (e) {
      throw new Error("Error listing users");
    }
  }),
  editUser: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(0).max(1023),
        role: z.string().min(0).max(1023),
        firstName: z.string().min(0).max(1023).optional().nullable(),
        lastName: z.string().min(0).max(1023).optional().nullable(),
        username: z.string().min(0).max(1023).optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      // if (!UseCheckRole("Admin")) {
      //   return { message: "Not Authorized" };
      // }
      try {
        const res = await clerkClient.users.updateUser(input.userId, {
          publicMetadata: { role: input.role },
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
          username: input.username ?? undefined,
        });

        return { res };
      } catch (e) {
        return { message: "Error updating user" };
      }
    }),
});

// getUserbyId: protectedProcedure
//   .input(
//     z.object({
//       id: z.string(),
//     }),
//   )
//   .query(async () => {
//     const response = await clerkClient.users.getUserList();
//     return response;
//   }),
