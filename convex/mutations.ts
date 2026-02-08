import { mutation } from "./_generated/server";
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

// Create a new workspace
export const createWorkspace = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("workspaces", {
      userId: user._id,
      name: args.name,
      icon: args.icon,
      color: args.color,
      order: args.order,
    });
  },
});

// Update a workspace (only if owned by user)
export const updateWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.optional(v.number())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a workspace and all its tiles (only if owned by user)
export const deleteWorkspace = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    // Delete all tiles in this workspace
    const wsTiles = await ctx.db
      .query("tiles")
      .withIndex("by_workspaceId", (q: any) => q.eq("workspaceId", args.id))
      .collect();
    for (const tile of wsTiles) {
      if (tile.userId === user._id) {
        await ctx.db.delete(tile._id);
      }
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create a new tile
export const createTile = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    color: v.string(),
    workspaceId: v.id("workspaces"),
    isFavorite: v.boolean(),
    lastAccessedAt: v.optional(v.number()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("tiles", {
      userId: user._id,
      name: args.name,
      url: args.url,
      icon: args.icon,
      color: args.color,
      workspaceId: args.workspaceId,
      isFavorite: args.isFavorite,
      lastAccessedAt: args.lastAccessedAt,
      order: args.order,
    });
  },
});

// Update a tile (only if owned by user)
export const updateTile = mutation({
  args: {
    id: v.id("tiles"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    icon: v.optional(v.optional(v.string())),
    color: v.optional(v.string()),
    workspaceId: v.optional(v.id("workspaces")),
    isFavorite: v.optional(v.boolean()),
    lastAccessedAt: v.optional(v.optional(v.number())),
    order: v.optional(v.optional(v.number())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(args.id, cleanUpdates);
    return args.id;
  },
});

// Delete a tile (only if owned by user)
export const deleteTile = mutation({
  args: { id: v.id("tiles") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Toggle favorite status on a tile
export const toggleFavorite = mutation({
  args: { id: v.id("tiles") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.patch(args.id, { isFavorite: !existing.isFavorite });
    return args.id;
  },
});

// Record tile access time
export const recordTileAccess = mutation({
  args: { id: v.id("tiles") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx) as BetterAuthUser | null;
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Not found or not authorized");
    }

    await ctx.db.patch(args.id, { lastAccessedAt: Date.now() });
    return args.id;
  },
});
