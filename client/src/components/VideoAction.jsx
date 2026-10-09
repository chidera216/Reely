function VideoAction({
  icon: Icon,
  label,
  onClick,
  active = false,
  activeClassName = "text-[#3B82F6]",
  ariaLabel,
}) {
  const accessibleLabel = ariaLabel || label || "More options";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      className="
        group
        flex min-w-16
        flex-col
        items-center
        gap-1.5
        text-white
        transition-transform duration-150
        active:scale-90
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-white/50
        focus-visible:ring-offset-2
        focus-visible:ring-offset-black
      "
    >
      <span
        className={`
          flex h-11 w-11
          items-center justify-center
          rounded-full
          transition-all duration-150
          group-hover:bg-white/8
          group-active:bg-white/10
          ${active ? activeClassName : "text-white"}
        `}
      >
        <Icon
          size={24}
          strokeWidth={1.8}
          fill={active ? "currentColor" : "none"}
        />
      </span>

      {label && (
        <span
          className="
            max-w-16
            truncate
            text-[12px]
            font-medium
            leading-none
            tracking-[-0.01em]
            text-white/90
          "
        >
          {label}
        </span>
      )}
    </button>
  );
}

export default VideoAction;
