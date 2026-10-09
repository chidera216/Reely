import { Check, X } from "lucide-react";
import { useState } from "react";

const reasons = [
  "Spam",
  "Harassment/bullying",
  "Hate speech",
  "Sexual content",
  "Violence",
  "Dangerous activities",
  "Copyright",
  "Other",
];

function ReportSheet({ onClose }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedReason) {
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="absolute inset-x-0 top-0 bottom-16 z-50 md:inset-0">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close report"
          onClick={onClose}
          className="absolute inset-0 w-full bg-black/70"
        />

        {/* Confirmation */}
        <section className="absolute inset-x-4 bottom-4 mx-auto overflow-hidden rounded-2xl border border-[#262833] bg-[#16171D] p-6 shadow-2xl md:inset-x-auto md:left-1/2 md:bottom-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
              <Check size={24} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-white">
              Report submitted
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-5 text-[#99A1B3]">
              Thanks for helping keep Reely safe. Our moderation team will
              review this report.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9]"
            >
              Done
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 top-0 bottom-16 z-50 md:inset-0">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close report"
        onClick={onClose}
        className="absolute inset-0 w-full bg-black/70"
      />

      {/* Report sheet */}
      <section className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88%] flex-col overflow-hidden rounded-t-[20px] border-t border-[#262833] bg-[#16171D] md:inset-x-4 md:bottom-4 md:max-w-lg md:rounded-2xl md:border">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#262833] px-4">
          <div className="w-9" />

          <h2 className="text-sm font-semibold text-white">Report video</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#99A1B3] transition-colors hover:bg-[#1F2026] hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        {/* Report form */}
        <form
          onSubmit={handleSubmit}
          className="comment-scrollbar min-h-0 overflow-y-auto"
        >
          <div className="p-4">
            <p className="text-sm font-medium text-white">
              Why are you reporting this video?
            </p>

            <p className="mt-1 text-xs leading-5 text-[#99A1B3]">
              Choose the reason that best describes the problem.
            </p>

            <div className="mt-4 space-y-2">
              {reasons.map((reason) => {
                const selected = selectedReason === reason;

                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-[#7C3AED] bg-[#7C3AED]/10 text-white"
                        : "border-[#262833] bg-[#12131A] text-[#99A1B3] hover:border-[#3B3D49] hover:text-white"
                    }`}
                  >
                    <span>{reason}</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#7C3AED] bg-[#7C3AED]"
                          : "border-[#525866]"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <label
                htmlFor="report-details"
                className="text-sm font-medium text-white"
              >
                Additional details
                <span className="ml-1 font-normal text-[#525866]">
                  (optional)
                </span>
              </label>

              <textarea
                id="report-details"
                value={details}
                onChange={(event) => {
                  setDetails(event.target.value.slice(0, 300));
                }}
                placeholder="Tell us more about the problem..."
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-[#262833] bg-[#12131A] px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-[#525866] focus:border-[#3B82F6]"
              />

              <div className="mt-1 text-right text-[11px] text-[#525866]">
                {details.length}/300
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[#262833] bg-[#16171D] p-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#262833] bg-[#12131A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1F2026]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedReason}
                className="flex-1 rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
              >
                Submit report
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ReportSheet;
