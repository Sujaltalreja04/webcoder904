import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Like a project
export const likeProject = mutation({
    args: { projectId: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("project_interactions")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                likes: existing.likes + 1,
            });
        } else {
            await ctx.db.insert("project_interactions", {
                projectId: args.projectId,
                likes: 1,
                views: 0,
            });
        }
        return { success: true };
    },
});

// View a project (flip card)
export const viewProject = mutation({
    args: { projectId: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("project_interactions")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                views: existing.views + 1,
            });
        } else {
            await ctx.db.insert("project_interactions", {
                projectId: args.projectId,
                likes: 0,
                views: 1,
            });
        }
        return { success: true };
    },
});

// Add a comment/review
export const addComment = mutation({
    args: {
        projectId: v.string(),
        author: v.string(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("project_comments", {
            projectId: args.projectId,
            author: args.author,
            comment: args.comment,
            createdAt: Date.now(),
        });
        return { success: true };
    },
});

// We query the number of likes/views ONLY for admin/logic.
// The frontend can choose to ignore these counts to keep them hidden 
// but still provide social proof functionality.
export const getProjectStats = query({
    args: { projectId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("project_interactions")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .first();
    },
});

export const getProjectComments = query({
    args: { projectId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("project_comments")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .order("desc")
            .collect();
    },
});
