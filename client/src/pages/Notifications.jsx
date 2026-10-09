import { Bell, Check, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Amara",
      username: "@amara",
      avatar: "https://i.pravatar.cc/96?img=32",
    },
    text: "liked your video",
    time: "2m",
    read: false,
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "David",
      username: "@david",
      avatar: "https://i.pravatar.cc/96?img=12",
    },
    text: "commented on your video",
    preview: "This is actually really good 🔥",
    time: "18m",
    read: false,
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Sarah",
      username: "@sarah",
      avatar: "https://i.pravatar.cc/96?img=47",
    },
    text: "started following you",
    time: "1h",
    read: false,
  },
  {
    id: 4,
    type: "reply",
    user: {
      name: "Michael",
      username: "@michael",
      avatar: "https://i.pravatar.cc/96?img=53",
    },
    text: "replied to your comment",
    preview: "Exactly! That's what I was thinking.",
    time: "3h",
    read: true,
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 5,
    type: "like",
    user: {
      name: "Chisom",
      username: "@chisom",
      avatar: "https://i.pravatar.cc/96?img=44",
    },
    text: "liked your video",
    time: "5h",
    read: true,
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 6,
    type: "comment",
    user: {
      name: "Emeka",
      username: "@emeka",
      avatar: "https://i.pravatar.cc/96?img=15",
    },
    text: "commented on your video",
    preview: "Keep building. This is going somewhere 🚀",
    time: "1d",
    read: true,
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

function NotificationIcon({ type }) {
  if (type === "like") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-[#FF3B5C]/10 text-[#FF3B5C]">
        <Heart size={15} fill="currentColor" strokeWidth={1.8} />
      </span>
    );
  }

  if (type === "comment") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-[#60A5FA]/10 text-[#60A5FA]">
        <MessageCircle size={15} strokeWidth={1.8} />
      </span>
    );
  }

  if (type === "reply") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-[#FBBF24]/10 text-[#FBBF24]">
        <MessageCircle size={15} strokeWidth={1.8} />
      </span>
    );
  }

  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-[#34D399]/10 text-[#34D399]">
      <UserPlus size={15} strokeWidth={1.8} />
    </span>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  return (
    <section
      className="
        relative
        h-svh
        overflow-y-auto
        overflow-x-hidden
        bg-[#050607]
        text-white
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      {/* Ambient background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_12%_0%,rgba(91,95,135,0.30)_0%,rgba(57,61,91,0.15)_22%,transparent_48%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-220px]
          top-[18%]
          size-[520px]
          rounded-full
          bg-[#633D72]/10
          blur-[150px]
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[760px]
          px-4
          pb-28
          pt-5
          sm:px-6
          md:pb-12
          md:pt-8
        "
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Activity
            </p>

            <div className="mt-1 flex items-center gap-2.5">
              <h1 className="text-[23px] font-semibold tracking-[-0.03em]">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span
                  className="
                    flex
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FF3B5C]
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.035]
                px-3.5
                py-2
                text-xs
                font-medium
                text-white/60
                backdrop-blur-xl
                transition-colors
                duration-200
                hover:bg-white/[0.07]
                hover:text-white
              "
            >
              <Check size={14} />
              Mark all read
            </button>
          )}
        </header>

        {/* Notifications */}
        <div className="mt-7">
          {notifications.length === 0 ? (
            <div
              className="
                flex
                min-h-[55vh]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  text-white/35
                "
              >
                <Bell size={25} strokeWidth={1.5} />
              </div>

              <h2 className="mt-5 text-base font-semibold text-white/85">
                You're all caught up
              </h2>

              <p className="mt-2 max-w-xs text-sm leading-6 text-white/35">
                New likes, comments, replies and followers will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.055]">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3
                    py-4
                    text-left
                    transition-colors
                    duration-200
                    hover:bg-white/[0.025]
                    ${
                      !notification.read
                        ? "before:absolute before:left-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-[#FF3B5C]"
                        : ""
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      className="
                        size-11
                        rounded-full
                        border
                        border-white/[0.08]
                        object-cover
                      "
                    />

                    <div className="absolute -bottom-1 -right-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        text-[13px]
                        leading-5
                        ${notification.read ? "text-white/55" : "text-white/80"}
                      `}
                    >
                      <span
                        className={
                          notification.read
                            ? "font-semibold text-white/75"
                            : "font-semibold text-white"
                        }
                      >
                        {notification.user.name}
                      </span>{" "}
                      {notification.text}
                    </p>

                    <p className="mt-0.5 text-[11px] text-white/30">
                      {notification.time}
                    </p>

                    {notification.preview && (
                      <p
                        className="
                          mt-2
                          truncate
                          text-xs
                          text-white/45
                        "
                      >
                        “{notification.preview}”
                      </p>
                    )}
                  </div>

                  {/* Video preview */}
                  {notification.video && (
                    <div
                      className="
                        relative
                        size-12
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-[#15171D]
                      "
                    >
                      <video
                        src={notification.video}
                        muted
                        playsInline
                        preload="metadata"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />

                      <div className="absolute inset-0 bg-black/15" />
                    </div>
                  )}

                  {/* Follow action */}
                  {notification.type === "follow" && (
                    <span
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-white/[0.10]
                        bg-white/[0.06]
                        px-3.5
                        py-2
                        text-[11px]
                        font-semibold
                        text-white/80
                        transition-colors
                        duration-200
                        group-hover:bg-white/[0.10]
                        group-hover:text-white
                      "
                    >
                      Follow
                    </span>
                  )}

                  {/* Mobile unread indicator */}
                  {!notification.read && (
                    <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#FF3B5C] md:hidden" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* End state */}
        {notifications.length > 0 && (
          <div className="flex justify-center py-10">
            <p className="text-[11px] text-white/20">You're all caught up</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Notifications;
