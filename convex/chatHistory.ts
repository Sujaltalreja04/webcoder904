import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new chat session
export const createSession = mutation({
    args: {
        sessionId: v.string(),
        userAgent: v.string(),
        referer: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("chat_sessions", {
            sessionId: args.sessionId,
            userAgent: args.userAgent,
            referer: args.referer,
            createdAt: Date.now(),
        });
        return args.sessionId;
    },
});

// Log a single chat message
export const logMessage = mutation({
    args: {
        sessionId: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("chat_messages", {
            sessionId: args.sessionId,
            role: args.role,
            content: args.content,
            timestamp: Date.now(),
        });
    },
});

// Get all messages for a session (for history display)
export const getMessages = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chat_messages")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .order("asc")
            .collect();
    },
});

// Get all sessions (admin view)
export const getAllSessions = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("chat_sessions").order("desc").collect();
    },
});
