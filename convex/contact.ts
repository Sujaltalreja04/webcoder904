import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Send a contact message
export const sendMessage = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("contact_messages", {
            name: args.name,
            email: args.email,
            subject: args.subject,
            message: args.message,
            createdAt: Date.now(),
        });
        return { success: true };
    },
});

// Admin view for fetching contact messages
export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contact_messages").order("desc").collect();
    },
});
