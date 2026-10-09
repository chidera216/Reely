import {
  ArrowLeft,
  Check,
  ChevronRight,
  Globe2,
  ImagePlus,
  LockKeyhole,
  MessageCircle,
  Upload as UploadIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_BYTES = 250 * 1024 * 1024;
const MAX_SECONDS = 180;
const MIN_SECONDS = 3;
const MAX_CAPTION = 150;
const ALLOWED_TYPES = ["video/mp4", "video/webm"];

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function Upload() {
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const coverInputRef = useRef(null);
  const videoUrlRef = useRef(null);
  const coverUrlRef = useRef(null);

  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [allowComments, setAllowComments] = useState(true);

  const [duration, setDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }

      if (coverUrlRef.current) {
        URL.revokeObjectURL(coverUrlRef.current);
      }
    };
  }, []);

  const resetUpload = () => {
    if (posting) return;

    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
    }

    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
    }

    videoUrlRef.current = null;
    coverUrlRef.current = null;

    setFile(null);
    setVideoUrl("");
    setCaption("");
    setVisibility("public");
    setAllowComments(true);
    setDuration(0);
    setVideoReady(false);
    setCoverFile(null);
    setCoverUrl("");
    setError("");
    setNotice("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setNotice("");

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Please choose an MP4 or WebM video.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_BYTES) {
      setError("Video must be 250MB or smaller.");
      event.target.value = "";
      return;
    }

    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    videoUrlRef.current = objectUrl;

    setFile(selectedFile);
    setVideoUrl(objectUrl);
    setDuration(0);
    setVideoReady(false);
  };

  const handleVideoMetadata = (event) => {
    const videoDuration = event.currentTarget.duration;

    setDuration(videoDuration);

    if (!Number.isFinite(videoDuration)) {
      setError("Unable to read the video's duration.");
      setVideoReady(false);
      return;
    }

    if (videoDuration < MIN_SECONDS) {
      setError("Video must be at least 3 seconds long.");
      setVideoReady(false);
      return;
    }

    if (videoDuration > MAX_SECONDS) {
      setError("Video must be 3 minutes or shorter.");
      setVideoReady(false);
      return;
    }

    setError("");
    setVideoReady(true);
  };

  const handleCoverSelect = (event) => {
    const selectedCover = event.target.files?.[0];

    if (!selectedCover) return;

    setError("");

    if (!selectedCover.type.startsWith("image/")) {
      setError("Cover must be an image.");
      event.target.value = "";
      return;
    }

    if (selectedCover.size > 10 * 1024 * 1024) {
      setError("Cover image must be 10MB or smaller.");
      event.target.value = "";
      return;
    }

    if (coverUrlRef.current) {
      URL.revokeObjectURL(coverUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selectedCover);

    coverUrlRef.current = objectUrl;

    setCoverFile(selectedCover);
    setCoverUrl(objectUrl);
  };

  const handlePost = async (event) => {
    event.preventDefault();

    if (posting) return;

    if (!file) {
      setError("Select a video before posting.");
      return;
    }

    if (!videoReady) {
      setError("Please use a video between 3 seconds and 3 minutes.");
      return;
    }

    if (!caption.trim()) {
      setError("Add a caption before posting.");
      return;
    }

    if (caption.trim().length > MAX_CAPTION) {
      setError(`Caption must be ${MAX_CAPTION} characters or fewer.`);
      return;
    }

    setError("");
    setNotice("");
    setPosting(true);

    try {
      const formData = new FormData();

      formData.append("video", file);
      formData.append("caption", caption.trim());
      formData.append("visibility", visibility);
      formData.append("allowComments", String(allowComments));

      const response = await fetch(`${API_URL}/api/posts/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response. Check your backend.",
        );
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in before publishing a video.");
        }

        throw new Error(data.message || "Failed to publish your video.");
      }

      setNotice(data.message || "Your video was published successfully.");

      window.setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.message || "Something went wrong while uploading your video.",
      );
    } finally {
      setPosting(false);
    }
  };

  const formatDuration = () => {
    if (!duration) return "0:00";

    const totalSeconds = Math.round(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const fileSize = file ? (file.size / (1024 * 1024)).toFixed(1) : null;

  return (
    <section
      className="
        relative h-svh overflow-x-hidden overflow-y-auto
        bg-[#050607] text-white
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        before:pointer-events-none before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_8%_8%,rgba(91,95,135,0.48)_0%,rgba(57,61,91,0.30)_18%,rgba(20,22,31,0.12)_38%,transparent_58%)]
        after:pointer-events-none after:absolute after:inset-0
        after:bg-[radial-gradient(circle_at_92%_55%,rgba(72,45,70,0.18)_0%,transparent_35%)]
      "
    >
      {/* Ambient background glow */}
      <div
        className="
          pointer-events-none absolute left-[-180px] top-[-180px]
          h-[500px] w-[500px] rounded-full
          bg-[#596080]/10 blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none absolute right-[-180px] top-[35%]
          h-[500px] w-[500px] rounded-full
          bg-[#6D3F78]/10 blur-[140px]
        "
      />

      <div
        className="
          relative z-10 mx-auto max-w-[1080px]
          px-4 pb-28 sm:px-6 md:px-8 md:pb-12
        "
      >
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={posting}
            className="group flex items-center gap-3 text-white"
          >
            <span
              className="
                flex size-9 items-center justify-center rounded-full
                text-[#B7BBC4] transition-colors
                group-hover:bg-white/5 group-hover:text-white
              "
            >
              <ArrowLeft size={21} strokeWidth={1.8} />
            </span>

            <span className="text-[20px] font-semibold tracking-[-0.025em]">
              New post
            </span>
          </button>

          <span className="hidden text-xs text-[#626875] sm:block">
            {file ? `${fileSize} MB` : "Create something"}
          </span>
        </header>

        <form onSubmit={handlePost}>
          <div
            className="
              grid gap-10
              lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]
              lg:items-start lg:gap-16
            "
          >
            {/* Video preview */}
            <div className="flex justify-center lg:sticky lg:top-6">
              {!videoUrl ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={posting}
                  className="
                    group relative flex aspect-[9/16] w-full
                    max-w-[390px] items-center justify-center overflow-hidden
                    rounded-[24px] border border-white/[0.07]
                    bg-[linear-gradient(145deg,#181A25_0%,#0B0D12_45%,#050607_100%)]
                    shadow-[0_30px_80px_rgba(0,0,0,0.28)]
                    transition-all duration-300
                    hover:border-white/[0.11]
                    hover:bg-[linear-gradient(145deg,#202332_0%,#0D0F15_45%,#050607_100%)]
                  "
                >
                  <div
                    className="
                      pointer-events-none absolute left-1/2 top-[22%]
                      size-48 -translate-x-1/2 rounded-full
                      bg-[#6B6F9A]/10 blur-[80px]
                    "
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <span
                      className="
                        flex size-14 items-center justify-center rounded-full
                        bg-white/[0.07] text-[#D7DAE0]
                        shadow-[0_12px_35px_rgba(0,0,0,0.25)]
                        transition-transform duration-200 group-hover:scale-105
                      "
                    >
                      <UploadIcon size={24} strokeWidth={1.7} />
                    </span>

                    <span className="mt-5 text-[15px] font-medium text-white">
                      Choose a video
                    </span>

                    <span className="mt-2 max-w-[210px] text-xs leading-5 text-[#686F7C]">
                      MP4 or WebM · up to 250MB · maximum 3 minutes
                    </span>
                  </div>
                </button>
              ) : (
                <div className="relative w-full max-w-[390px]">
                  {/* Ambient video */}
                  <video
                    src={videoUrl}
                    muted
                    playsInline
                    loop
                    autoPlay
                    className="
                      absolute inset-0 h-full w-full scale-110
                      rounded-[28px] object-cover opacity-20 blur-3xl
                    "
                  />

                  {/* Main video */}
                  <div
                    className="
                      relative mx-auto aspect-[9/16] w-full overflow-hidden
                      rounded-[24px] bg-black
                      shadow-[0_30px_80px_rgba(0,0,0,0.55)]
                    "
                  >
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      poster={coverUrl || undefined}
                      onLoadedMetadata={handleVideoMetadata}
                      className="h-full w-full object-contain"
                    />

                    <div
                      className="
                        pointer-events-none absolute left-3 top-3
                        rounded-full bg-black/45 px-2.5 py-1
                        text-[10px] font-medium text-white/80 backdrop-blur-md
                      "
                    >
                      {formatDuration()}
                    </div>

                    <button
                      type="button"
                      onClick={resetUpload}
                      disabled={posting}
                      aria-label="Remove video"
                      className="
                        absolute right-3 top-3 flex size-9 items-center
                        justify-center rounded-full bg-black/45 text-white
                        backdrop-blur-md transition-colors hover:bg-black/70
                        disabled:opacity-50
                      "
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post controls */}
            <div className="min-w-0 lg:pt-2">
              {/* Caption */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="caption"
                    className="text-[15px] font-medium text-white"
                  >
                    Caption
                  </label>

                  <span
                    className={`text-xs ${
                      caption.length >= MAX_CAPTION
                        ? "text-[#FCA5A5]"
                        : "text-[#555B66]"
                    }`}
                  >
                    {caption.length}/{MAX_CAPTION}
                  </span>
                </div>

                <textarea
                  id="caption"
                  value={caption}
                  onChange={(event) => {
                    setCaption(event.target.value.slice(0, MAX_CAPTION));
                    setError("");
                    setNotice("");
                  }}
                  placeholder="Add a caption..."
                  rows={3}
                  disabled={posting}
                  className="
                    mt-3 w-full resize-none border-0 bg-transparent p-0
                    text-[16px] leading-7 text-white outline-none
                    placeholder:text-[#626875]
                  "
                />
              </div>

              <div className="my-5 h-px bg-white/[0.07]" />

              {/* Mention / Hashtag */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCaption(
                      (current) =>
                        `${current}${current && !current.endsWith(" ") ? " " : ""}@`,
                    );
                  }}
                  disabled={posting}
                  className="
                    rounded-full bg-[#17191F] px-4 py-2.5 text-sm
                    text-[#D8DBE1] shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                    transition-colors hover:bg-[#1E2027]
                  "
                >
                  @ Mention
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCaption(
                      (current) =>
                        `${current}${current && !current.endsWith(" ") ? " " : ""}#`,
                    );
                  }}
                  disabled={posting}
                  className="
                    rounded-full bg-[#17191F] px-4 py-2.5 text-sm
                    text-[#D8DBE1] shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                    transition-colors hover:bg-[#1E2027]
                  "
                >
                  # Hashtag
                </button>
              </div>

              {/* Settings */}
              <div className="mt-4 divide-y divide-white/[0.07]">
                {/* Cover */}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={posting}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span
                    className="
                      flex size-10 shrink-0 items-center justify-center
                      rounded-full bg-white/[0.055] text-[#C5C9D1]
                    "
                  >
                    <ImagePlus size={20} strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-white">
                      Cover
                    </span>

                    <span className="mt-1 block truncate text-xs text-[#666D79]">
                      {coverFile
                        ? "Custom cover selected"
                        : "Choose a cover image"}
                    </span>
                  </span>

                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Selected cover"
                      className="size-11 rounded-lg object-cover"
                    />
                  ) : (
                    <ChevronRight size={19} className="text-[#666D79]" />
                  )}
                </button>

                {/* Visibility */}
                <div className="flex items-center gap-4 py-5">
                  <span
                    className="
                      flex size-10 shrink-0 items-center justify-center
                      rounded-full bg-white/[0.055] text-[#C5C9D1]
                    "
                  >
                    {visibility === "public" ? (
                      <Globe2 size={20} strokeWidth={1.8} />
                    ) : (
                      <LockKeyhole size={20} strokeWidth={1.8} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-white">
                      Visibility
                    </p>

                    <p className="mt-1 text-xs text-[#666D79]">
                      {visibility === "public"
                        ? "Anyone can see this video"
                        : "Only you can see this video"}
                    </p>
                  </div>

                  <div className="flex rounded-full bg-[#15171C] p-1">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      disabled={posting}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        visibility === "public"
                          ? "bg-white text-[#090A0D]"
                          : "text-[#777E8A]"
                      }`}
                    >
                      Public
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisibility("private")}
                      disabled={posting}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        visibility === "private"
                          ? "bg-white text-[#090A0D]"
                          : "text-[#777E8A]"
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-4 py-5">
                  <span
                    className="
                      flex size-10 shrink-0 items-center justify-center
                      rounded-full bg-white/[0.055] text-[#C5C9D1]
                    "
                  >
                    <MessageCircle size={20} strokeWidth={1.8} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-white">
                      Comments
                    </p>

                    <p className="mt-1 text-xs text-[#666D79]">
                      Allow people to comment
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={allowComments}
                    aria-label={
                      allowComments ? "Disable comments" : "Enable comments"
                    }
                    disabled={posting}
                    onClick={() => setAllowComments((current) => !current)}
                    className={`
                      relative h-7 w-12 shrink-0 rounded-full
                      transition-colors duration-200
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/30
                      ${allowComments ? "bg-white" : "bg-[#2B2E35]"}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 size-5 rounded-full
                        transition-[left,background-color] duration-200
                        ${
                          allowComments
                            ? "left-6 bg-[#090A0D]"
                            : "left-1 bg-[#747B87]"
                        }
                      `}
                    />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="
                    mt-5 rounded-xl bg-[#EF4444]/[0.07]
                    px-4 py-3 text-sm text-[#FCA5A5]
                  "
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {notice && (
                <div
                  role="status"
                  className="
                    mt-5 rounded-xl bg-[#10B981]/[0.07]
                    px-4 py-3 text-sm text-[#6EE7B7]
                  "
                >
                  {notice}
                </div>
              )}

              {/* Post button */}
              <button
                type="submit"
                disabled={posting}
                className="
                  mt-7 flex h-12 w-full items-center justify-center gap-2
                  rounded-full bg-[#FF3B5C] text-sm font-semibold text-white
                  shadow-[0_12px_35px_rgba(255,59,92,0.16)]
                  transition-all hover:bg-[#FF5270] active:scale-[0.99]
                  disabled:cursor-not-allowed disabled:opacity-50
                  disabled:shadow-none
                "
              >
                {posting ? (
                  <>
                    <span
                      className="
                        size-4 animate-spin rounded-full border-2
                        border-white/30 border-t-white
                      "
                    />
                    Posting...
                  </>
                ) : (
                  <>
                    <Check size={17} strokeWidth={2} />
                    Post
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] text-[#4F5560]">
                Your video will be processed before publishing.
              </p>
            </div>
          </div>

          {/* Hidden video input */}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Hidden cover input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
}

export default Upload;
