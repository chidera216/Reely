function Avatar({ src, name = "", size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-20 w-20 text-xl",
  };

  const initials = name.trim().slice(0, 1).toUpperCase();

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-[#1F2026] font-semibold text-white ${sizes[size]}`}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {initials || "U"}
        </div>
      )}
    </div>
  );
}

export default Avatar;
