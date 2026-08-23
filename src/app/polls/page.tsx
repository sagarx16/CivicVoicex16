"use client";

import AppLayout from "@/components/AppLayout";
import { useState } from "react";

const polls = [
  {
    id: 1,
    title: "Should we expand the city bike lane network?",
    description: "The city council is considering adding 15 miles of protected bike lanes. This would affect parking on 8 major roads.",
    category: "Transport",
    endDate: "Aug 25, 2026",
    daysLeft: 3,
    totalVotes: 1840,
    options: [
      { label: "Yes, strongly support", votes: 1251, percent: 68 },
      { label: "Yes, with modifications", votes: 294, percent: 16 },
      { label: "No, need more study", votes: 184, percent: 10 },
      { label: "Strongly oppose", votes: 111, percent: 6 },
    ],
    voted: false,
    icon: "directions_bike",
    theme: {
      primaryText: "text-blue-600 dark:text-blue-400",
      primaryBg: "bg-blue-50 dark:bg-blue-950/20",
      badge: "text-blue-600 border border-blue-200 dark:text-blue-400 dark:border-blue-800/30",
      border: "border-blue-100 dark:border-blue-900/20",
      progressBg: "bg-blue-500/20 dark:bg-blue-500/10",
      progressFill: "bg-gradient-to-r from-blue-500 to-indigo-500",
      borderHex: "#3b82f6",
    }
  },
  {
    id: 2,
    title: "New community center location preference",
    description: "The city has shortlisted 3 locations for the new community center. Which do you prefer?",
    category: "Community",
    endDate: "Aug 27, 2026",
    daysLeft: 5,
    totalVotes: 924,
    options: [
      { label: "Riverside Park site", votes: 480, percent: 52 },
      { label: "Downtown Plaza site", votes: 277, percent: 30 },
      { label: "East District site", votes: 167, percent: 18 },
    ],
    voted: true,
    userVote: 0,
    icon: "location_city",
    theme: {
      primaryText: "text-amber-600 dark:text-amber-400",
      primaryBg: "bg-amber-50 dark:bg-amber-950/20",
      badge: "text-amber-600 border border-amber-200 dark:text-amber-400 dark:border-amber-800/30",
      border: "border-amber-100 dark:border-amber-900/20",
      progressBg: "bg-amber-500/20 dark:bg-amber-500/10",
      progressFill: "bg-gradient-to-r from-amber-500 to-orange-500",
      borderHex: "#f59e0b",
    }
  },
  {
    id: 3,
    title: "Extended park hours during summer?",
    description: "Should city parks remain open until 10 PM instead of 8 PM during summer months?",
    category: "Parks",
    endDate: "Aug 30, 2026",
    daysLeft: 8,
    totalVotes: 456,
    options: [
      { label: "Yes, extend to 10 PM", votes: 310, percent: 68 },
      { label: "Yes, but only weekends", votes: 91, percent: 20 },
      { label: "No, keep current hours", votes: 55, percent: 12 },
    ],
    voted: false,
    icon: "park",
    theme: {
      primaryText: "text-emerald-600 dark:text-emerald-400",
      primaryBg: "bg-emerald-50 dark:bg-emerald-950/20",
      badge: "text-emerald-600 border border-emerald-200 dark:text-emerald-400 dark:border-emerald-800/30",
      border: "border-emerald-100 dark:border-emerald-900/20",
      progressBg: "bg-emerald-500/20 dark:bg-emerald-500/10",
      progressFill: "bg-gradient-to-r from-emerald-500 to-teal-500",
      borderHex: "#10b981",
    }
  },
];

export default function PollsPage() {
  const [filter, setFilter] = useState("Active");
  const [votedPolls, setVotedPolls] = useState<Record<number, number>>({ 2: 0 });

  const handleVote = (pollId: number, optionIdx: number) => {
    setVotedPolls((prev) => ({ ...prev, [pollId]: optionIdx }));
  };

  return (
    <AppLayout>
      <div className="max-w-[800px] mx-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-md font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px] md:text-[36px] icon-filled">
                ballot
              </span>
              Polls &amp; Surveys
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              Make your voice heard on community decisions
            </p>
          </div>
          <div className="flex bg-surface-container rounded-lg p-1 gap-1 self-start sm:self-auto overflow-x-auto">
            {["Active", "Closed", "My Votes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-label-md transition-colors whitespace-nowrap ${
                  filter === tab
                    ? "bg-surface-container-lowest text-on-surface shadow-subtle"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {polls.map((poll) => {
            const hasVoted = votedPolls[poll.id] !== undefined;
            const userVoteIdx = votedPolls[poll.id];

            return (
              <div
                key={poll.id}
                className="civic-card p-6 border-l-4 transition-all duration-300 hover:shadow-hover"
                style={{ borderLeftColor: poll.theme.borderHex }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110">
                    <span className={`material-symbols-outlined icon-filled ${poll.theme.primaryText} text-[32px]`}>
                      {poll.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 justify-between">
                      <h2 className="text-headline-sm font-semibold text-on-surface leading-snug">
                        {poll.title}
                      </h2>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-label-sm font-semibold px-2.5 py-0.5 rounded-full ${poll.theme.badge}`}>
                          {poll.daysLeft}d left
                        </span>
                        <span className="text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full font-medium">
                          {poll.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">{poll.description}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {poll.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={hasVoted}
                      onClick={() => handleVote(poll.id, i)}
                      className={`w-full text-left rounded-xl border transition-all duration-200 ${
                        hasVoted 
                          ? userVoteIdx === i 
                            ? `${poll.theme.border} bg-surface-container-lowest` 
                            : "border-outline-variant/30 bg-surface-container-lowest"
                          : "border-outline-variant/50 hover:border-primary hover:shadow-subtle bg-white cursor-pointer"
                      } p-4`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {hasVoted ? (
                            userVoteIdx === i ? (
                              <span className={`material-symbols-outlined icon-filled ${poll.theme.primaryText} text-[20px]`}>
                                check_circle
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">
                                radio_button_unchecked
                              </span>
                            )
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors text-[20px]">
                              radio_button_unchecked
                            </span>
                          )}
                          <span className={`text-body-md transition-colors ${hasVoted && userVoteIdx === i ? `${poll.theme.primaryText} font-bold` : "text-on-surface"}`}>
                            {opt.label}
                          </span>
                        </div>
                        {hasVoted && (
                          <span className={`text-label-md font-bold ${userVoteIdx === i ? poll.theme.primaryText : 'text-on-surface-variant'} shrink-0`}>
                            {opt.percent}%
                          </span>
                        )}
                      </div>
                      
                      {/* Elegant thin progress bar shown after voting */}
                      {hasVoted && (
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden mt-3">
                          <div 
                            className={`h-full rounded-full ${userVoteIdx === i ? poll.theme.progressFill : 'bg-outline-variant/40'}`} 
                            style={{ width: `${opt.percent}%` }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/20">
                  <span className="text-label-sm text-on-surface-variant flex items-center gap-1.5 hover:text-on-surface transition-colors">
                    <span className={`material-symbols-outlined ${poll.theme.primaryText} text-[16px]`}>groups</span>
                    <strong className="text-on-surface font-semibold">{poll.totalVotes.toLocaleString()}</strong> participants
                  </span>
                  <span className="text-label-sm text-on-surface-variant flex items-center gap-1.5 hover:text-on-surface transition-colors">
                    <span className={`material-symbols-outlined ${poll.theme.primaryText} text-[16px]`}>calendar_today</span>
                    Ends <strong className="text-on-surface font-semibold">{poll.endDate}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
