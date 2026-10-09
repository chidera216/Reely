import {
  ArrowLeft,
  Hash,
  Search as SearchIcon,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const people = [
  {
    id: 1,
    name: "Amara",
    username: "@amara",
    avatar: "https://i.pravatar.cc/96?img=32",
    bio: "Creating little moments ☀️",
    followers: 8420,
    verified: false,
  },
  {
    id: 2,
    name: "Chidex",
    username: "@chidex",
    avatar: "https://i.pravatar.cc/96?img=11",
    bio: "Building something from the ground up 🚀",
    followers: 1284,
    verified: false,
  },
  {
    id: 3,
    name: "Creator",
    username: "@creator",
    avatar: "https://i.pravatar.cc/96?img=12",
    bio: "Just creating.",
    followers: 12400,
    verified: true,
  },
];

const hashtags = [
  {
    id: 1,
    name: "#javascript",
    posts: 12840,
  },
  {
    id: 2,
    name: "#webdevelopment",
    posts: 8420,
  },
  {
    id: 3,
    name: "#esut",
    posts: 1920,
  },
  {
    id: 4,
    name: "#tech",
    posts: 18500,
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

function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const isHashtagSearch = normalizedQuery.startsWith("#");
  const isUsernameSearch = normalizedQuery.startsWith("@");

  const peopleResults = people.filter((person) => {
    if (!normalizedQuery) {
      return false;
    }

    const searchValue = normalizedQuery.replace(/^@/, "");

    return (
      person.username.toLowerCase().includes(searchValue) ||
      person.name.toLowerCase().includes(searchValue)
    );
  });

  const hashtagResults = hashtags.filter((hashtag) => {
    if (!normalizedQuery) {
      return false;
    }

    const searchValue = normalizedQuery.replace(/^#/, "");

    return hashtag.name.toLowerCase().includes(searchValue);
  });

  const hasResults = peopleResults.length > 0 || hashtagResults.length > 0;

  const clearSearch = () => {
    setQuery("");
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
          bg-[radial-gradient(circle_at_12%_0%,rgba(91,95,135,0.32)_0%,rgba(57,61,91,0.15)_22%,transparent_48%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-220px]
          top-[15%]
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
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.035]
              text-white/65
              backdrop-blur-xl
              transition-colors
              duration-200
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Discover
            </p>

            <h1 className="mt-1 text-[23px] font-semibold tracking-[-0.03em]">
              Search
            </h1>
          </div>
        </header>

        {/* Search Input */}
        <div className="relative mt-7">
          <SearchIcon
            size={19}
            strokeWidth={1.8}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-white/30
            "
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people or hashtags"
            autoFocus
            className="
              h-12
              w-full
              appearance-none
              rounded-full
              border
              border-white/[0.07]
              bg-white/[0.025]
              pl-11
              pr-12
              text-sm
              text-white
              outline-none
              backdrop-blur-xl
              transition-colors
              duration-200
              placeholder:text-white/30
              focus:border-white/[0.12]
              focus:bg-white/[0.03]
              focus:ring-1
              focus:ring-white/[0.06]
              [&::-webkit-search-cancel-button]:appearance-none
              [&::-webkit-search-decoration]:appearance-none
            "
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                absolute
                right-2
                top-1/2
                flex
                size-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/[0.05]
                text-white/50
                transition-colors
                duration-200
                hover:bg-white/[0.09]
                hover:text-white
              "
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Empty / Initial State */}
        {!normalizedQuery && (
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
                text-white/30
              "
            >
              <SearchIcon size={25} strokeWidth={1.5} />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white/80">
              Find something interesting
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-white/35">
              Search for a creator with @username or discover videos through a
              #hashtag.
            </p>
          </div>
        )}

        {/* No Results */}
        {normalizedQuery && !hasResults && (
          <div
            className="
              flex
              min-h-[50vh]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                flex
                size-14
                items-center
                justify-center
                rounded-full
                bg-white/[0.04]
                text-white/25
              "
            >
              <SearchIcon size={23} strokeWidth={1.5} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-white/75">
              No results
            </h2>

            <p className="mt-2 max-w-xs text-sm text-white/35">
              We couldn't find anything matching "{query}".
            </p>
          </div>
        )}

        {/* Results */}
        {normalizedQuery && hasResults && (
          <div className="mt-8">
            {/* People */}
            {peopleResults.length > 0 && !isHashtagSearch && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound size={15} className="text-white/40" />

                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                    People
                  </h2>
                </div>

                <div className="divide-y divide-white/[0.055]">
                  {peopleResults.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        py-4
                        text-left
                        transition-colors
                        duration-200
                        hover:bg-white/[0.025]
                      "
                    >
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="
                          size-12
                          shrink-0
                          rounded-full
                          border
                          border-white/[0.08]
                          object-cover
                        "
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold text-white">
                            {person.name}
                          </p>

                          {person.verified && (
                            <span
                              className="
                                flex
                                size-4
                                items-center
                                justify-center
                                rounded-full
                                bg-[#3B82F6]
                                text-[9px]
                                font-bold
                                text-white
                              "
                            >
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-white/35">
                          {person.username} · {formatCount(person.followers)}{" "}
                          followers
                        </p>

                        <p className="mt-1 truncate text-xs text-white/45">
                          {person.bio}
                        </p>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          border
                          border-white/[0.08]
                          bg-white/[0.035]
                          px-3
                          py-2
                          text-[11px]
                          font-semibold
                          text-white/55
                          transition-colors
                          duration-200
                          group-hover:bg-white/[0.07]
                          group-hover:text-white
                        "
                      >
                        View
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Hashtags */}
            {hashtagResults.length > 0 && !isUsernameSearch && (
              <section
                className={
                  peopleResults.length > 0 && !isHashtagSearch ? "mt-9" : ""
                }
              >
                <div className="mb-3 flex items-center gap-2">
                  <Hash size={15} className="text-white/40" />

                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                    Hashtags
                  </h2>
                </div>

                <div className="divide-y divide-white/[0.055]">
                  {hashtagResults.map((hashtag) => (
                    <button
                      key={hashtag.id}
                      type="button"
                      onClick={() =>
                        navigate(`/hashtag/${hashtag.name.slice(1)}`)
                      }
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        py-4
                        text-left
                        transition-colors
                        duration-200
                        hover:bg-white/[0.025]
                      "
                    >
                      <span
                        className="
                          flex
                          size-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FBBF24]/10
                          text-[#FBBF24]
                        "
                      >
                        <Hash size={20} strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">
                          {hashtag.name}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {formatCount(hashtag.posts)} videos
                        </p>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          border
                          border-white/[0.08]
                          bg-white/[0.035]
                          px-3
                          py-2
                          text-[11px]
                          font-semibold
                          text-white/55
                          transition-colors
                          duration-200
                          group-hover:bg-white/[0.07]
                          group-hover:text-white
                        "
                      >
                        View
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Search Hint */}
        {normalizedQuery && (
          <p className="mt-10 text-center text-[11px] text-white/20">
            Search supports usernames and hashtags.
          </p>
        )}
      </div>
    </section>
  );
}

export default Search;
