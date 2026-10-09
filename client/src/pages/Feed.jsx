import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function normalizePost(post) {
  const creator = post.creator || post.user || {};

  return {
    ...post,
    id: String(post._id || post.id),
    src: post.videoUrl || post.video || post.src || post.url || "",
    displayName:
      post.displayName ||
      creator.displayName ||
      creator.name ||
      creator.username ||
      "Reely creator",
    username: post.username || creator.username || "creator",
    avatar: post.avatar || creator.avatar || creator.profilePicture || "",
    caption: post.caption || post.description || "",
    likes: Number(post.likesCount ?? post.likes ?? 0),
    comments: Number(post.commentsCount ?? post.comments ?? 0),
    shares: Number(post.sharesCount ?? post.shares ?? 0),
    saves: Number(post.savesCount ?? post.saves ?? 0),
    isLiked: Boolean(post.isLiked),
    foundingCreator: Boolean(post.foundingCreator || creator.foundingCreator),
  };
}

function Feed() {
  const navigate = useNavigate();
  const feedRef = useRef(null);
  const itemRefs = useRef(new Map());

  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("reely-sound-enabled") === "true";
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/posts`, {
          credentials: "include",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Couldn't load videos.");
        }

        const posts = Array.isArray(data)
          ? data
          : data.posts || data.data?.posts || data.data || [];

        const normalizedPosts = Array.isArray(posts)
          ? posts.map(normalizePost).filter((post) => post.src)
          : [];

        setVideos(normalizedPosts);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Couldn't connect to Reely.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("reely-sound-enabled", String(soundEnabled));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, [soundEnabled]);

  const setItemRef = useCallback((index, element) => {
    if (element) {
      itemRefs.current.set(index, element);
    } else {
      itemRefs.current.delete(index);
    }
  }, []);

  useEffect(() => {
    const root = feedRef.current;

    if (!root || !videos.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (
            !bestEntry ||
            entry.intersectionRatio > bestEntry.intersectionRatio
          ) {
            bestEntry = entry;
          }
        }

        if (bestEntry) {
          const index = Number(bestEntry.target.dataset.index);

          if (Number.isInteger(index)) {
            setActiveIndex(index);
          }
        }
      },
      {
        root,
        threshold: [0.25, 0.5, 0.65, 0.8, 1],
      },
    );

    itemRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [videos.length]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((enabled) => !enabled);
  }, []);

  const preloadedIndexes = useMemo(
    () => new Set([activeIndex, activeIndex + 1]),
    [activeIndex],
  );

  return (
    <section
      ref={feedRef}
      aria-label="Video feed"
      className="
        feed-scroll relative
        h-[calc(100dvh_-_56px_-_env(safe-area-inset-bottom))]
        snap-y snap-mandatory
        overflow-y-auto overflow-x-hidden
        overscroll-y-contain
        bg-[#050607]
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        md:h-dvh
      "
    >
      {/* Mobile search button */}
      <button
        type="button"
        onClick={() => navigate("/search")}
        aria-label="Search Reely"
        className="
          absolute right-4 top-4 z-40
          flex size-10 items-center justify-center
          rounded-full border border-white/10
          bg-black/25 text-white backdrop-blur-xl
          transition hover:bg-black/45
          md:hidden
        "
      >
        <Search size={19} />
      </button>

      {/* Loading state */}
      {loading && (
        <div className="flex h-full items-center justify-center text-sm text-white/60">
          Loading videos…
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-medium text-white">
            Couldn't load the feed
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-white/50">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-4 rounded-full border border-white/10
              bg-white/[0.07] px-4 py-2
              text-sm text-white transition
              hover:bg-white/[0.12]
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-medium text-white">No videos yet</p>

          <p className="mt-2 text-xs text-white/50">
            Be the first to share something with Reely.
          </p>
        </div>
      )}

      {/* Video feed */}
      {!loading &&
        !error &&
        videos.map((video, index) => (
          <div
            key={video.id}
            ref={(element) => setItemRef(index, element)}
            data-feed-item
            data-index={index}
            className="
              relative h-full min-h-full w-full
              snap-start snap-always
              md:h-dvh md:min-h-dvh
            "
          >
            <VideoCard
              video={video}
              isActive={index === activeIndex}
              shouldPreload={preloadedIndexes.has(index)}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
            />
          </div>
        ))}
    </section>
  );
}

export default Feed;
