import { query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

// Type for Better Auth user (for TypeScript)
interface BetterAuthUser {
  _id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  createdAt: number;
  updatedAt: number;
}

// List all workspaces for the authenticated user
// Available as: api.queries.listWorkspaces OR api.queries.getMyWorkspaces
export const listWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listWorkspaces - use whichever name you prefer
export const getMyWorkspaces = listWorkspaces;

// Get a single workspace by ID (only if owned by user)
export const getWorkspace = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});

// List all tiles for the authenticated user
// Available as: api.queries.listTiles OR api.queries.getMyTiles
export const listTiles = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return [];

    return await ctx.db
      .query("tiles")
      .withIndex("by_user", (q: any) => q.eq("userId", user._id))
      .collect();
  },
});

// Alias for listTiles - use whichever name you prefer
export const getMyTiles = listTiles;

// Get a single tile by ID (only if owned by user)
export const getTile = query({
  args: { id: v.id("tiles") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) return null;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return null;
    return item;
  },
});
