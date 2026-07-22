import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAllEmployees, addEmployee, deleteEmployee, createRequisition, getRequisitions, getRequisitionById, updateRequisitionStatus } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: publicProcedure.query(async () => {
      return await getAllEmployees();
    }),
    add: adminProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input }) => {
      return await addEmployee(input.name);
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      return await deleteEmployee(input.id);
    }),
  }),

  requisitions: router({
    create: protectedProcedure
      .input(z.object({
        employeeName: z.string().min(1),
        items: z.string(),
        totalAmount: z.number(),
        note: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createRequisition({
          employeeName: input.employeeName,
          items: input.items,
          totalAmount: input.totalAmount,
          note: input.note,
          status: "pending",
        });
      }),
    
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await getRequisitions(input.limit, input.offset);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getRequisitionById(input.id);
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        return await updateRequisitionStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
