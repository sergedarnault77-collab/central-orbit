import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Better Auth tables (user, session, account, verification) are managed
  // automatically by the @convex-dev/better-auth component.

  // Application tables
  workspaces: defineTable({
    userId: v.string(),
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    order: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_order", ["order"]),

  tiles: defineTable({
    userId: v.string(),
    name: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    color: v.string(),
    workspaceId: v.id("workspaces"),
    isFavorite: v.boolean(),
    lastAccessedAt: v.optional(v.number()),
    order: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_isFavorite", ["isFavorite"])
    .index("by_lastAccessedAt", ["lastAccessedAt"]),
});
