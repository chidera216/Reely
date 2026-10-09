import { useEffect, useState } from "react";
import { Heart, Send, X } from "lucide-react";
import { useAuth } from "../context/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getUsername(comment) {
  const username =
    comment.creator?.username || comment.creator?.displayName || "user";

  return username.startsWith("@") ? username : `@${username}`;
}

function getInitial(comment) {
  const username =
    comment.creator?.username || comment.creator?.displayName || "U";

  return username.replace("@", "").charAt(0).toUpperCase();
}

function getTimeLabel(dateString) {
  if (!dateString) return "Just now";

  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );

  if (!Number.isFinite(seconds) || seconds < 0) {
    return "Just now";
  }

  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  return `${Math.floor(seconds / 86400)}d ago`;
}

function CommentItem({ comment, replyingTo, setReplyingTo }) {
  const replies = comment.replies || [];

  return (
    <div className="py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
          {getInitial(comment)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            {getUsername(comment)}
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-zinc-200">
            {comment.text}
          </p>

          <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
            <span>{getTimeLabel(comment.createdAt)}</span>

            <button
              type="button"
              onClick={() =>
                setReplyingTo(replyingTo === comment._id ? null : comment._id)
              }
              className="font-semibold transition hover:text-white"
            >
              {replyingTo === comment._id ? "Cancel reply" : "Reply"}
            </button>
          </div>

          {replies.length > 0 && (
            <div className="mt-3 space-y-3 border-l border-zinc-700 pl-3">
              {replies.map((reply) => (
                <div key={reply._id} className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-white">
                    {getInitial(reply)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">
                      {getUsername(reply)}
                    </p>

                    <p className="mt-1 break-words text-sm text-zinc-300">
                      {reply.text}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {getTimeLabel(reply.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Like comment"
          title="Comment likes are not connected yet"
          className="flex shrink-0 flex-col items-center gap-1 pt-1 text-zinc-400 transition hover:text-pink-500"
        >
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
}

export default function CommentSheet({
  postId,
  onClose,
  onCommentsCountChange,
}) {
  const { isAuthenticated, requireAuth } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchComments() {
      try {
        const response = await fetch(
          `${API_URL}/api/posts/${postId}/comments`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (controller.signal.aborted) return;

        if (response.status === 403) {
          setCommentsDisabled(true);
          setComments([]);
          setError("");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Could not load comments.");
        }

        setComments(data.comments || []);
        setCommentsDisabled(false);
        setError("");

        onCommentsCountChange?.(data.commentsCount ?? 0);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message || "Could not load comments.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchComments();

    return () => controller.abort();
  }, [postId, retryKey, onCommentsCountChange]);

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanText = text.trim();

    if (!cleanText || submitting || loading || commentsDisabled) {
      return;
    }

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          parentComment: replyingTo || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not post your comment.");
      }

      const newComment = data.comment;

      if (replyingTo) {
        setComments((currentComments) =>
          currentComments.map((comment) =>
            comment._id === replyingTo
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                }
              : comment,
          ),
        );
      } else {
        setComments((currentComments) => [newComment, ...currentComments]);
      }

      if (typeof data.commentsCount === "number") {
        onCommentsCountChange?.(data.commentsCount);
      }

      setText("");
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || "Could not post your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setLoading(true);
    setError("");
    setRetryKey((current) => current + 1);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close comments"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <section className="relative flex max-h-[85%] w-full flex-col overflow-hidden rounded-t-2xl border border-zinc-800 bg-zinc-950 sm:max-w-lg">
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <h2 className="text-base font-semibold text-white">Comments</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-zinc-400">
              Loading comments...
            </p>
          ) : commentsDisabled ? (
            <p className="py-10 text-center text-sm text-zinc-400">
              Comments are disabled for this video.
            </p>
          ) : error && comments.length === 0 ? (
            <div className="py-10 text-center">
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 text-sm font-semibold text-white underline"
              >
                Try again
              </button>
            </div>
          ) : comments.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-400">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
              />
            ))
          )}

          {error && comments.length > 0 && (
            <p role="alert" className="py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {!commentsDisabled && (
          <form
            onSubmit={handleSubmit}
            className="border-t border-zinc-800 p-3"
          >
            {replyingTo && (
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                <span>Replying to comment</span>

                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <p className="mb-2 text-xs text-zinc-400">
                Sign in to join the conversation.
              </p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                  replyingTo ? "Write a reply..." : "Add a comment..."
                }
                maxLength={1000}
                disabled={loading || submitting}
                className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!text.trim() || submitting || loading}
                aria-label={replyingTo ? "Send reply" : "Send comment"}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>

            {submitting && (
              <p className="mt-2 text-xs text-zinc-400">Posting...</p>
            )}
          </form>
        )}
      </section>
    </div>
  );
}
