import {
  Edit3,
  Grid3X3,
  LogOut,
  MoreHorizontal,
  Play,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

const defaultProfile = {
  displayName: "Chidex",
  username: "@chidex",
  avatar: "https://i.pravatar.cc/200?img=11",
  bio: "Building, learning and creating 🚀",
  followers: 1284,
  following: 186,
  videos: 24,
  verified: false,
  foundingCreator: true,
};

const videos = [
  {
    id: 1,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 2940,
    pinned: true,
  },
  {
    id: 2,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 1842,
    pinned: true,
  },
  {
    id: 3,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 928,
    pinned: false,
  },
  {
    id: 4,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 761,
    pinned: false,
  },
  {
    id: 5,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 524,
    pinned: false,
  },
  {
    id: 6,
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    views: 381,
    pinned: false,
  },
];

function formatCount(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return String(count);
}

function EditProfileModal({ profile, onClose, onSave }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  const canSave =
    displayName.trim().length > 0 &&
    displayName.trim().length <= 50 &&
    bio.length <= 160 &&
    avatar.length <= 2048 &&
    !saving;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setSaveError("");

    try {
      await onSave({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
      });

      onClose();
    } catch (error) {
      setSaveError(
        error.message || "Unable to save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-[#262833] bg-[#0E0F13] px-3 text-sm text-white outline-none transition placeholder:text-[#4F5562] hover:border-[#343742] focus:border-white/25 focus:ring-2 focus:ring-white/[0.04]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#0B0C0F] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-[17px] font-semibold text-white">
              Edit profile
            </h2>

            <p className="mt-0.5 text-xs text-white/35">
              Update how people see you on Reely.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit profile"
            className="flex size-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.025] text-white/45 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="size-[72px] shrink-0 overflow-hidden rounded-full border border-white/[0.1] bg-[#17191F]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white/40">
                  {displayName.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-white">Profile photo</p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Enter an image URL. File uploads can be added when we connect
                image storage.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="profile-avatar"
              className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
            >
              Photo URL
            </label>

            <input
              id="profile-avatar"
              type="url"
              value={avatar}
              maxLength={2048}
              onChange={(event) => setAvatar(event.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="profile-display-name"
                className="text-xs font-medium text-[#D4D7DE]"
              >
                Display name
              </label>

              <span className="text-[10px] text-white/25">
                {displayName.length}/50
              </span>
            </div>

            <input
              id="profile-display-name"
              type="text"
              value={displayName}
              maxLength={50}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="profile-username"
              className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
            >
              Username
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#525866]">
                @
              </span>

              <input
                id="profile-username"
                type="text"
                value={profile.username.replace(/^@/, "")}
                disabled
                className={`${inputClass} cursor-not-allowed pl-7 opacity-60`}
              />
            </div>

            <p className="mt-1.5 text-[11px] text-white/25">
              Your username cannot be changed here.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="profile-bio"
                className="text-xs font-medium text-[#D4D7DE]"
              >
                Bio
              </label>

              <span
                className={`text-[10px] ${
                  bio.length > 160 ? "text-[#EF4444]" : "text-white/25"
                }`}
              >
                {bio.length}/160
              </span>
            </div>

            <textarea
              id="profile-bio"
              value={bio}
              maxLength={160}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell people a little about yourself..."
              rows={4}
              className="w-full resize-none rounded-xl border border-[#262833] bg-[#0E0F13] px-3 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-[#4F5562] hover:border-[#343742] focus:border-white/25 focus:ring-2 focus:ring-white/[0.04]"
            />
          </div>

          {saveError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
            >
              {saveError}
            </p>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 flex-1 rounded-xl border border-[#262833] bg-[#101115] text-sm font-semibold text-white/75 transition hover:border-[#343742] hover:bg-[#15161B] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSave}
              className="h-11 flex-1 rounded-xl bg-[#FF3B5C] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,59,92,0.16)] transition-all hover:bg-[#FF5270] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B5C]/40"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Profile() {
  const { user, updateUser, logout, requireAuth } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const profile = {
    ...defaultProfile,
    ...(user
      ? {
          displayName: user.displayName || "",
          username: user.username
            ? user.username.startsWith("@")
              ? user.username
              : `@${user.username}`
            : "",
          avatar: user.avatar || "",
          bio: user.bio || "",
          verified: Boolean(user.isVerified),
          foundingCreator: Boolean(user.isFoundingCreator),
        }
      : {}),
  };

  const sortedVideos = [...videos].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned),
  );

  const handleLogout = async () => {
    setShowMenu(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSaveProfile = async (updates) => {
    if (!user) {
      requireAuth();
      throw new Error("Please log in to edit your profile.");
    }

    const API_URL = (
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    ).replace(/\/+$/, "");

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Unable to update your profile.");
    }

    if (!data.user) {
      throw new Error("The server did not return your updated profile.");
    }

    updateUser(data.user);
  };

  return (
    <>
      <section className="relative h-svh overflow-y-auto overflow-x-hidden bg-[#050607] text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(91,95,135,0.35)_0%,rgba(57,61,91,0.18)_22%,transparent_48%)]" />

        <div className="pointer-events-none absolute right-[-180px] top-[10%] size-[520px] rounded-full bg-[#633D72]/10 blur-[140px]" />

        <div className="pointer-events-none absolute left-[20%] top-[35%] size-[360px] rounded-full bg-[#3B82F6]/[0.04] blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[980px] px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-8">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Profile
              </p>

              <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">
                {profile.username || "Profile"}
              </h1>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((current) => !current)}
                aria-label="Profile menu"
                className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
              >
                <MoreHorizontal size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#16171D]/95 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);

                      if (!user) {
                        requireAuth();
                        return;
                      }

                      setShowEditProfile(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-white/80 transition-colors hover:bg-white/[0.05]"
                  >
                    <Edit3 size={17} />
                    Edit profile
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-3 border-t border-white/[0.07] px-4 py-3.5 text-left text-sm text-white/80 transition-colors hover:bg-white/[0.05]"
                  >
                    <Settings size={17} />
                    Settings
                  </button>

                  {user && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 border-t border-white/[0.07] px-4 py-3.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.05]"
                    >
                      <LogOut size={17} />
                      Log out
                    </button>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Profile introduction */}
          <div className="mt-8 grid gap-7 md:grid-cols-[150px_1fr] md:items-center md:gap-10">
            <div className="flex justify-center md:justify-start">
              <div className="relative size-[126px] overflow-hidden rounded-full border border-white/[0.12] bg-[#17191F] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:size-[150px]">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName || "Profile"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full text-4xl font-semibold text-white/40">
                    {(profile.displayName || "?").charAt(0).toUpperCase()}
                  </div>
                )}

                {profile.verified && (
                  <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full border-2 border-[#050607] bg-[#3B82F6] text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[22px] font-semibold tracking-[-0.025em]">
                      {profile.displayName || "Your name"}
                    </h2>

                    {profile.foundingCreator && (
                      <span className="rounded-full border border-[#FBBF24]/20 bg-[#FBBF24]/[0.07] px-2.5 py-1 text-[10px] font-semibold text-[#FCD77A]">
                        Founding Creator
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-white/45">
                    {profile.username}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        requireAuth();
                        return;
                      }

                      setShowEditProfile(true);
                    }}
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#FF3B5C] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,59,92,0.16)] transition-all duration-200 hover:bg-[#FF5270]"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    aria-label="Profile settings"
                    className="flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Settings size={17} />
                  </button>
                </div>
              </div>

              {/* Profile stats */}
              <div className="mt-6 flex items-center gap-7 sm:gap-9">
                <div>
                  <p className="text-[17px] font-semibold">
                    {formatCount(profile.videos)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">Videos</p>
                </div>

                <div>
                  <p className="text-[17px] font-semibold">
                    {formatCount(profile.followers)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">Followers</p>
                </div>

                <div>
                  <p className="text-[17px] font-semibold">
                    {formatCount(profile.following)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">Following</p>
                </div>
              </div>

              <p className="mt-5 max-w-[560px] whitespace-pre-wrap text-sm leading-6 text-white/65">
                {profile.bio}
              </p>
            </div>
          </div>

          <div className="mt-10 h-px bg-white/[0.07]" />

          {/* Video section */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-2">
              <Grid3X3 size={17} className="text-white/65" />
              <span className="text-sm font-medium text-white/75">Videos</span>
            </div>

            <span className="text-xs text-white/30">
              {profile.videos} posts
            </span>
          </div>

          {/* Demo video grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
            {sortedVideos.map((video) => (
              <button
                key={video.id}
                type="button"
                className="group relative aspect-[4/5] overflow-hidden rounded-[4px] bg-[#121319] text-left outline-none ring-white transition focus-visible:ring-2 md:rounded-lg"
              >
                <video
                  src={video.src}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />

                {video.pinned && (
                  <div className="absolute left-2 top-2 rounded-full bg-black/55 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                    Pinned
                  </div>
                )}

                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                  <Play size={11} fill="currentColor" />
                  {formatCount(video.views)}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center py-12">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  requireAuth();
                }
              }}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.07] hover:text-white"
            >
              <Plus size={15} />
              Create a video
            </button>
          </div>
        </div>
      </section>

      {showEditProfile && user && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}

export default Profile;
