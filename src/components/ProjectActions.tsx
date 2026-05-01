import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send } from 'lucide-react';
import { useSafeMutation } from '../hooks/useConvexSafe';
import { api } from '../../convex/_generated/api';

interface ProjectActionsProps {
    projectId: string;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [commentSent, setCommentSent] = useState(false);

    const likeProject = useSafeMutation(api.projects.likeProject);
    const addComment = useSafeMutation(api.projects.addComment);

    // Load from local storage to keep state per user
    useEffect(() => {
        const liked = localStorage.getItem(`liked_${projectId}`);
        if (liked) setIsLiked(true);
    }, [projectId]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) return;

        try {
            setIsLiked(true);
            localStorage.setItem(`liked_${projectId}`, "true");
            await likeProject({ projectId });
        } catch (error) {
            console.error("Failed to like project:", error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await addComment({
                projectId,
                author: authorName.trim() || 'Anonymous',
                comment: comment.trim()
            });
            setCommentSent(true);
            setComment('');
            setAuthorName('');
            setTimeout(() => {
                setCommentSent(false);
                setShowCommentInput(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <div className="w-full flex-col gap-2 relative z-50 mt-2">
            <div className="flex items-center gap-2">
                <motion.button
                    className={`flex-1 backdrop-blur-md rounded-lg px-3 py-2 md:px-4 md:py-2.5 font-semibold flex items-center justify-center gap-2 text-sm md:text-base border transition-colors ${isLiked
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                        : 'bg-[rgba(192,192,192,0.1)] border-[rgba(192,192,192,0.3)] text-gray-300'
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    disabled={isLiked}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'LIKED' : 'LIKE'}
                </motion.button>

                <motion.button
                    className="flex-1 backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-gray-300 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowCommentInput(!showCommentInput);
                    }}
                >
                    <MessageSquare className="w-4 h-4" />
                    REVIEW
                </motion.button>
            </div>

            <AnimatePresence>
                {showCommentInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {commentSent ? (
                            <div className="text-xs text-center text-emerald-400 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                Review submitted successfully!
                            </div>
                        ) : (
                            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    placeholder="Your Name (Optional)"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-400"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Leave a review..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!comment.trim()}
                                        className="bg-gray-700/50 rounded-lg px-3 flex items-center justify-center hover:bg-gray-600/50 disabled:opacity-50 transition-colors"
                                    >
                                        <Send className="w-4 h-4 text-gray-300" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
