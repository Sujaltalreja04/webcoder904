import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    chat_sessions: defineTable({
        sessionId: v.string(),
        userAgent: v.string(),
        referer: v.string(),
        createdAt: v.number(),
    }).index("by_sessionId", ["sessionId"]),

    chat_messages: defineTable({
        sessionId: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
    }).index("by_sessionId", ["sessionId"]),

    contact_messages: defineTable({
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
        createdAt: v.number(),
    }),

    project_interactions: defineTable({
        projectId: v.string(),
        likes: v.number(),
        views: v.number(),
    }).index("by_projectId", ["projectId"]),

    project_comments: defineTable({
        projectId: v.string(),
        author: v.string(),
        comment: v.string(),
        createdAt: v.number(),
    }).index("by_projectId", ["projectId"]),
});
