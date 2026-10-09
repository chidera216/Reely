import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../context/useAuth";

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.49a4.69 4.69 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.4 3.05-7.67Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.3-2.56c-.92.62-2.09.98-3.47.98-2.67 0-4.93-1.8-5.74-4.22H2.85v2.64A10.22 10.22 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.26 13.73A6.14 6.14 0 0 1 5.94 12c0-.6.1-1.18.32-1.73V7.63H2.85A10.01 10.01 0 0 0 2 12c0 1.61.39 3.14 1.08 4.47l3.18-2.74Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.05c1.5 0 2.85.52 3.91 1.54l2.93-2.93C17.08 3.02 14.76 2 12 2a10.22 10.22 0 0 0-9.15 5.63l3.41 2.64C7.07 7.85 9.33 6.05 12 6.05Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const inputClassName = `
  h-11 w-full rounded-xl border border-[#262833]
  bg-[#0E0F13] px-3 text-sm text-white outline-none
  transition-all duration-150 placeholder:text-[#4F5562]
  hover:border-[#343742] focus:border-white/25
  focus:bg-[#101116] focus:ring-2 focus:ring-white/[0.04]
`;

const passwordInputClassName = `
  h-11 w-full rounded-xl border border-[#262833]
  bg-[#0E0F13] pl-3 pr-11 text-sm text-white outline-none
  transition-all duration-150 placeholder:text-[#4F5562]
  hover:border-[#343742] focus:border-white/25
  focus:bg-[#101116] focus:ring-2 focus:ring-white/[0.04]
`;

const primaryButtonClassName = `
  h-11 w-full rounded-xl bg-[#FF3B5C] text-sm font-semibold
  text-white shadow-[0_8px_24px_rgba(255,59,92,0.16)]
  transition-all duration-150 hover:bg-[#FF5270]
  active:scale-[0.99] disabled:cursor-not-allowed
  disabled:opacity-40 disabled:shadow-none
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[#FF3B5C]/40
`;

function AuthModal({ onClose }) {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [dob, setDob] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [usernameCheck, setUsernameCheck] = useState({
    value: "",
    status: "idle",
    suggestion: "",
  });

  const normalizedUsername = username.trim().toLowerCase();

  useEffect(() => {
    if (!normalizedUsername) return undefined;

    const timer = setTimeout(() => {
      const valid =
        normalizedUsername.length <= 30 &&
        /^[a-z0-9_]+$/.test(normalizedUsername);

      setUsernameCheck({
        value: normalizedUsername,
        status: valid ? "available" : "invalid",
        suggestion: "",
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [normalizedUsername]);

  const usernameStatus = !normalizedUsername
    ? "idle"
    : usernameCheck.value === normalizedUsername
      ? usernameCheck.status
      : "checking";

  function isOldEnough() {
    if (!dob) return false;

    const birthDate = new Date(`${dob}T00:00:00`);

    if (Number.isNaN(birthDate.getTime())) return false;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age >= 16 && birthDate <= today;
  }

  function changeMode(nextMode) {
    if (isSubmitting) return;

    setMode(nextMode);
    setFormError("");
  }

  function syncLoginEmail(event) {
    const value = event.currentTarget.value;
    setLoginEmail(value);
  }

  function syncSignupEmail(event) {
    const value = event.currentTarget.value;
    setSignupEmail(value);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setFormError("");

    // Read the actual input values in case browser autofill
    // updated the DOM without updating React state.
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setFormError("Enter your email and password.");
      return;
    }

    setLoginEmail(email);
    setLoginPassword(password);
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (error) {
      setFormError(error.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (
      !displayName.trim() ||
      !normalizedUsername ||
      !signupEmail.trim() ||
      signupPassword.length < 10 ||
      usernameStatus !== "available" ||
      !isOldEnough()
    ) {
      setFormError("Check your details and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        displayName: displayName.trim(),
        username: normalizedUsername,
        email: signupEmail.trim(),
        password: signupPassword,
        dateOfBirth: dob,
      });
    } catch (error) {
      setFormError(error.message || "Unable to create your account.");

      if (error.field === "username") {
        setUsernameCheck({
          value: normalizedUsername,
          status: "taken",
          suggestion: `${normalizedUsername}_01`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div
      className="
        fixed inset-0 z-[100] flex items-center justify-center
        bg-black/75 px-4 py-6 backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-label="Reely authentication"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative flex max-h-[92vh] w-full max-w-[420px]
          flex-col overflow-hidden rounded-[20px] border
          border-white/[0.07] bg-[#0B0C0F]
          shadow-[0_24px_80px_rgba(0,0,0,0.55)]
        "
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close authentication"
          className="
            absolute right-4 top-4 z-20 flex size-9
            items-center justify-center rounded-full border
            border-white/[0.06] bg-white/[0.025]
            text-[#777D89] transition-all duration-150
            hover:bg-white/[0.06] hover:text-white
            active:scale-95 disabled:opacity-40
          "
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        <div className="px-6 pb-5 pt-8 text-center">
          <h1 className="text-[22px] font-bold tracking-[-0.025em] text-white">
            Welcome to Reely
          </h1>
          <p className="mt-2 text-sm text-[#777D89]">
            Watch, create, and connect.
          </p>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-2 rounded-xl border border-white/[0.05] bg-[#090A0D] p-1">
            {["login", "signup"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeMode(item)}
                disabled={isSubmitting}
                className={`
                  rounded-lg py-2.5 text-sm transition-all duration-150
                  ${
                    mode === item
                      ? "bg-[#17191F] font-semibold text-white shadow-sm"
                      : "font-medium text-[#777D89] hover:text-white"
                  }
                `}
              >
                {item === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-5">
          <button
            type="button"
            disabled
            title="Google sign-in has not been configured yet"
            className="
              flex h-11 w-full cursor-not-allowed items-center
              justify-center gap-3 rounded-xl border
              border-[#262833] bg-[#101115] text-sm
              font-semibold text-white opacity-60
            "
          >
            <GoogleIcon />
            <span>Continue with Google</span>
            <span className="text-[10px] font-normal text-[#777D89]">Soon</span>
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1D1F24]" />
            <span className="text-[11px] font-medium text-[#525866]">OR</span>
            <div className="h-px flex-1 bg-[#1D1F24]" />
          </div>

          {formError && (
            <p
              role="alert"
              className="
                mb-4 rounded-lg border border-red-500/20
                bg-red-500/10 px-3 py-2 text-sm text-red-400
              "
            >
              {formError}
            </p>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={syncLoginEmail}
                  onInput={syncLoginEmail}
                  onBlur={syncLoginEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    className={passwordInputClassName}
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((current) => !current)}
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute right-1 top-1/2 flex size-9
                      -translate-y-1/2 items-center justify-center
                      rounded-lg text-[#626875] transition-colors
                      hover:text-white
                    "
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled
                  title="Password recovery will be added later"
                  className="cursor-not-allowed text-xs font-medium text-[#626875]"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !loginEmail.trim() || !loginPassword}
                className={primaryButtonClassName}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="display-name"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Display name
                </label>

                <input
                  id="display-name"
                  name="name"
                  type="text"
                  required
                  maxLength={50}
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  autoFocus
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Username
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#525866]">
                    @
                  </span>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    maxLength={30}
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, ""),
                      )
                    }
                    placeholder="username"
                    autoComplete="username"
                    className={`${inputClassName} pl-7`}
                  />
                </div>

                {usernameStatus === "checking" && (
                  <p className="mt-1.5 text-xs text-[#666D7A]">
                    Checking username format...
                  </p>
                )}

                {usernameStatus === "available" && (
                  <p className="mt-1.5 text-xs text-[#10B981]">
                    Username format looks good
                  </p>
                )}

                {usernameStatus === "taken" && (
                  <p className="mt-1.5 text-xs text-[#EF4444]">
                    Username is taken. Try @{usernameCheck.suggestion}
                  </p>
                )}

                {usernameStatus === "invalid" && (
                  <p className="mt-1.5 text-xs text-[#EF4444]">
                    Use 1–30 letters, numbers, or underscores.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Email
                </label>

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={syncSignupEmail}
                  onInput={syncSignupEmail}
                  onBlur={syncSignupEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="signup-password"
                    name="new-password"
                    type={showSignupPassword ? "text" : "password"}
                    required
                    minLength={10}
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    placeholder="At least 10 characters"
                    autoComplete="new-password"
                    className={passwordInputClassName}
                  />

                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((current) => !current)}
                    aria-label={
                      showSignupPassword ? "Hide password" : "Show password"
                    }
                    className="
                      absolute right-1 top-1/2 flex size-9
                      -translate-y-1/2 items-center justify-center
                      rounded-lg text-[#626875] transition-colors
                      hover:text-white
                    "
                  >
                    {showSignupPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p
                  className={`mt-1.5 text-xs ${
                    signupPassword.length >= 10
                      ? "text-[#10B981]"
                      : "text-[#525866]"
                  }`}
                >
                  {signupPassword.length}/10 minimum
                </p>
              </div>

              <div>
                <label
                  htmlFor="dob"
                  className="mb-1.5 block text-xs font-medium text-[#D4D7DE]"
                >
                  Date of birth
                </label>

                <input
                  id="dob"
                  name="bday"
                  type="date"
                  required
                  value={dob}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setDob(event.target.value)}
                  autoComplete="bday"
                  className={inputClassName}
                />

                {dob && !isOldEnough() && (
                  <p className="mt-1.5 text-xs text-[#EF4444]">
                    You must be at least 16 years old.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !displayName.trim() ||
                  !signupEmail.trim() ||
                  signupPassword.length < 10 ||
                  usernameStatus !== "available" ||
                  !isOldEnough()
                }
                className={primaryButtonClassName}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[10px] leading-5 text-[#4F5562]">
            By continuing, you agree to Reely&apos;s Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
