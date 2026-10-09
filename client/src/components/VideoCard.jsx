import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import Avatar from "./Avatar";
import CommentSheet from "./CommentSheet";
import ReportSheet from "./ReportSheet";
import VideoAction from "./VideoAction";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function formatCount(count = 0) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

function VideoCard({
  video,
  isActive,
  shouldPreload,
  soundEnabled,
  onToggleSound,
}) {
  const { isAuthenticated, requireAuth } = useAuth();
  const videoRef = useRef(null);
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const heartTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  const [liked, setLiked] = useState(Boolean(video.isLiked));
  const [likesCount, setLikesCount] = useState(Number(video.likes ?? 0));
  const [likeLoading, setLikeLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    Number(video.commentsCount ?? video.comments ?? 0),
  );
  const [showReport, setShowReport] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const element = videoRef.current;
    if (element) element.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    if (!isActive) {
      element.pause();
      return;
    }

    if (!hasError) {
      element.play().catch(() => {});
    }
  }, [isActive, hasError]);

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    };
  }, []);

  const showTemporaryToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 1800);
  };

  const showProgressBriefly = () => {
    setShowProgress(true);
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    progressTimerRef.current = setTimeout(() => setShowProgress(false), 900);
  };

  const savePlaybackPosition = () => {
    const element = videoRef.current;
    if (!element || !Number.isFinite(element.currentTime)) return;

    try {
      localStorage.setItem(
        `reely-video-position-${video.id}`,
        String(element.currentTime),
      );
    } catch {
      // Local storage may be unavailable in private browsing.
    }
  };

  const restorePlaybackPosition = () => {
    const element = videoRef.current;
    if (!element || !Number.isFinite(element.duration)) return;

    try {
      const position = Number(
        localStorage.getItem(`reely-video-position-${video.id}`),
      );

      if (
        Number.isFinite(position) &&
        position > 0 &&
        position < element.duration
      ) {
        element.currentTime = position;
        setProgress((position / element.duration) * 100);
      }
    } catch {
      // Continue playback if the saved position cannot be read.
    }
  };

  const handleLoadedMetadata = () => {
    const element = videoRef.current;
    if (!element) return;

    if (element.videoWidth && element.videoHeight) {
      const ratio = element.videoWidth / element.videoHeight;

      if (ratio > 1.15) {
        setOrientation("landscape");
      } else if (ratio < 0.85) {
        setOrientation("portrait");
      } else {
        setOrientation("square");
      }
    }

    restorePlaybackPosition();
  };

  const togglePlay = async () => {
    const element = videoRef.current;
    if (!element || hasError) return;

    try {
      if (element.paused) {
        await element.play();
      } else {
        element.pause();
        savePlaybackPosition();
      }
      showProgressBriefly();
    } catch {
      // Playback can fail if the browser blocks playback.
    }
  };

  const handleVideoTap = (event) => {
    const now = event.timeStamp;

    if (now - lastTapRef.current < 280) {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }

      lastTapRef.current = 0;

      if (!isAuthenticated) {
        requireAuth();
        return;
      }

      if (!liked) void toggleLike(true);

      setHeartBurst(true);
      if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
      heartTimerRef.current = setTimeout(() => setHeartBurst(false), 650);
      return;
    }

    lastTapRef.current = now;
    singleTapTimerRef.current = setTimeout(togglePlay, 250);
  };

  const toggleLike = async (forceLike) => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    if (likeLoading) return;

    const nextLiked = typeof forceLike === "boolean" ? forceLike : !liked;

    if (nextLiked === liked) return;

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(nextLiked);
    setLikesCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));
    setLikeLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/posts/${video.id}/like`, {
        method: nextLiked ? "POST" : "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update like.");
      }

      setLiked(Boolean(data.isLiked));
      setLikesCount(Number(data.likesCount ?? 0));
    } catch (error) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      showTemporaryToast(error.message || "Couldn't update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const toggleSave = () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    setSaved((current) => !current);
  };

  const toggleFollow = () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    setFollowing((current) => !current);
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    setShowComments(true);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${video.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${video.displayName} on Reely`,
          text: video.caption,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        showTemporaryToast("Link copied");
        return;
      }

      showTemporaryToast("Copy the page link to share");
    } catch {
      // Sharing may be cancelled by the user.
    }
  };

  const handleReport = () => {
    setShowMore(false);
    setShowReport(true);
  };

  const handleNotInterested = () => {
    setShowMore(false);
    showTemporaryToast("We'll show you less like this");
  };

  const handleTimeUpdate = () => {
    const element = videoRef.current;
    if (!element || !element.duration) return;

    setProgress((element.currentTime / element.duration) * 100);
    if (isActive) savePlaybackPosition();
  };

  const handleLoadedData = () => {
    setIsReady(true);
    setIsBuffering(false);
    setHasError(false);
  };

  const handleWaiting = () => {
    const element = videoRef.current;
    if (!element || !isActive) return;

    if (element.duration && element.currentTime >= element.duration - 0.25) {
      return;
    }

    if (element.readyState < 3) setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsPlaying(true);
    setIsBuffering(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (isActive) savePlaybackPosition();
  };

  const handleRetry = () => {
    const element = videoRef.current;
    if (!element) return;

    setHasError(false);
    setIsReady(false);
    setIsBuffering(true);
    element.load();

    if (isActive) element.play().catch(() => setIsPlaying(false));
  };

  const currentSaves =
    Number(video.saves ?? video.savesCount ?? 0) + (saved ? 1 : 0);

  const actionRail = (
    <div className="flex w-[56px] shrink-0 flex-col items-center gap-2.5 sm:w-[60px] sm:gap-3">
      <VideoAction
        icon={Heart}
        label={formatCount(likesCount)}
        active={liked}
        activeClassName="text-[#EF4444]"
        onClick={() => toggleLike()}
        ariaLabel={`${liked ? "Unlike" : "Like"} video`}
      />

      <VideoAction
        icon={MessageCircle}
        label={formatCount(commentsCount)}
        onClick={handleComment}
        ariaLabel="Comments"
      />

      <VideoAction
        icon={Share2}
        label={formatCount(Number(video.sharesCount ?? video.shares ?? 0))}
        onClick={handleShare}
        ariaLabel="Share video"
      />

      <VideoAction
        icon={Bookmark}
        label={formatCount(currentSaves)}
        active={saved}
        activeClassName="text-[#A78BFA]"
        onClick={toggleSave}
        ariaLabel={saved ? "Remove saved video" : "Save video"}
      />

      <div className="relative">
        <VideoAction
          icon={MoreHorizontal}
          ariaLabel="More video options"
          onClick={() => setShowMore((current) => !current)}
        />

        {showMore && (
          <div className="absolute bottom-12 right-0 z-50 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#16171D]/95 shadow-xl backdrop-blur-2xl">
            <button
              type="button"
              onClick={handleReport}
              className="flex w-full items-center gap-3 border-b border-white/[0.07] px-4 py-3.5 text-left text-sm font-medium text-[#EF4444] hover:bg-white/[0.05]"
            >
              <Flag size={18} />
              Report
            </button>

            <button
              type="button"
              onClick={handleNotInterested}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-white hover:bg-white/[0.05]"
            >
              <MoreHorizontal size={18} />
              Not interested
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const creatorDetails = (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <div className="shrink-0 rounded-full ring-2 ring-white/20">
          <Avatar src={video.avatar} name={video.displayName} size="md" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="break-words text-sm font-semibold text-white drop-shadow-lg">
              {video.displayName}
            </span>

            {video.verified && (
              <span
                title="Verified"
                aria-label="Verified creator"
                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-[10px] font-bold text-white"
              >
                ✓
              </span>
            )}

            {video.foundingCreator && (
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[9px] text-white/85">
                Founding Creator
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="break-all text-xs text-white/70">
              @{String(video.username || "creator").replace(/^@/, "")}
            </span>

            <button
              type="button"
              onClick={toggleFollow}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                following
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {following ? "Following" : "+ Follow"}
            </button>
          </div>
        </div>
      </div>

      {video.caption && (
        <p className="mt-2 line-clamp-2 break-words text-[13px] leading-[1.4] text-white drop-shadow-lg">
          {video.caption}
        </p>
      )}
    </div>
  );

  return (
    <article className="relative h-full min-h-full w-full overflow-hidden bg-[#050607]">
      {/* Blurred ambient background */}
      <video
        src={video.src}
        muted
        loop
        playsInline
        autoPlay={isActive}
        preload={isActive ? "auto" : "metadata"}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-[45px] transition-opacity duration-700 ${
          isActive ? "opacity-35" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* Adaptive video stage */}
      <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4">
        <div
          className={`relative flex max-h-full max-w-full items-stretch ${
            orientation === "landscape"
              ? "h-auto w-full max-w-[min(900px,85vw)]"
              : orientation === "square"
                ? "h-auto w-auto max-h-full max-w-full"
                : "h-full w-auto max-w-full"
          }`}
        >
          <div
            className={`relative min-w-0 overflow-hidden bg-black ${
              orientation === "landscape"
                ? "aspect-video w-full"
                : orientation === "square"
                  ? "aspect-square h-auto max-h-full max-w-full"
                  : "aspect-[9/16] h-full max-w-full"
            }`}
            style={
              orientation === "landscape"
                ? { maxHeight: "100%", width: "min(78vw, 900px)" }
                : orientation === "square"
                  ? { height: "min(100%, 78vw)" }
                  : undefined
            }
          >
            <video
              ref={videoRef}
              src={video.src}
              muted={!soundEnabled}
              loop
              playsInline
              autoPlay={isActive}
              preload={shouldPreload ? "auto" : "metadata"}
              onClick={handleVideoTap}
              onPlay={handlePlaying}
              onPause={handlePause}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
              onCanPlay={() => setIsBuffering(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onLoadedData={handleLoadedData}
              onError={() => {
                setHasError(true);
                setIsPlaying(false);
                setIsBuffering(false);
              }}
              className="absolute inset-0 h-full w-full select-none object-cover"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/35 to-transparent" />

            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mute video" : "Turn sound on"}
              title={soundEnabled ? "Mute video" : "Turn sound on"}
              className="absolute right-3 top-3 z-30 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
            </button>

            {isActive && !isReady && !hasError && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="size-9 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}

            {isActive && isReady && isBuffering && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}

            {isActive && hasError && (
              <div className="absolute inset-0 z-40 flex items-center justify-center px-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    Video unavailable
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    We couldn't load this video.
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-4 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <span
                className={`flex size-16 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all duration-200 ${
                  isPlaying ? "scale-90 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                <Play size={27} fill="currentColor" className="ml-1" />
              </span>
            </div>

            <div
              className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-all duration-300 ${
                heartBurst ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <Heart
                size={110}
                fill="currentColor"
                className="text-[#EF4444] drop-shadow-xl"
              />
            </div>

            {/* Creator details */}
            <div className="absolute bottom-3 left-3 right-[68px] z-30 sm:bottom-5 sm:left-4 sm:right-[72px]">
              {creatorDetails}
            </div>

            {/* Mobile action rail */}
            <div className="absolute bottom-4 right-1.5 z-30 md:hidden">
              {actionRail}
            </div>

            {showProgress && (
              <div className="absolute inset-x-0 bottom-0 z-40 h-0.5 bg-white/15">
                <div
                  className="h-full bg-white transition-[width] duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Desktop action rail beside the frame */}
          <div className="hidden shrink-0 items-center justify-center pl-3 md:flex">
            {actionRail}
          </div>
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[#16171D]/95 px-4 py-2.5 text-xs font-medium text-white shadow-lg backdrop-blur-xl md:bottom-8">
          {toast}
        </div>
      )}

      {showComments && (
        <CommentSheet
          postId={video.id}
          onClose={() => setShowComments(false)}
          onCommentsCountChange={setCommentsCount}
        />
      )}

      {showReport && <ReportSheet onClose={() => setShowReport(false)} />}
    </article>
  );
}

export default VideoCard;
