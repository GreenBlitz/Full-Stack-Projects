// בס"ד
import React, { useState, useMemo } from "react";
import useLocalStorage from "./Hooks/LocalStorageHook";
import { useEventData } from "./Hooks/useEventData";
import { useMatchProcessing } from "./Hooks/useMatchProcessing";
import { Header } from "./components/Header";
import { EventInfoBar } from "./components/EventInfoBar";
import { CurrentMatchStatus } from "./components/CurrentMatchStatus";
import { SectionTitle } from "./components/SectionTitle";
import { FinalResults } from "./components/FinalResults";
import { MatchCard } from "./components/MatchCard";
import { EmptyState } from "./components/EmptyState";
import { noGap } from "./config/frcConfig";

const App: React.FC = () => {
  const [activeEventKey, setActiveEventKey] = useLocalStorage<string>(
    "dashboard_active_event",
    ""
  );
  const [inputEventKey, setInputEventKey] = useState<string>(activeEventKey);

  const { teams, allMatches, teamRank, searchStatus, performSearch } =
    useEventData(activeEventKey, setActiveEventKey);

  const {
    currentGlobalMatch,
    targetTeamMatches,
    futureMatches,
    isEventOver,
    isTeamDone,
    isFutureEvent,
  } = useMatchProcessing(allMatches);

  const teamNameMap = useMemo(() => {
    const record: Record<string, string> = {};
    teams.forEach((team) => {
      record[team.key] = team.nickname;
    });
    return record;
  }, [teams]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formattedKey = inputEventKey.trim().toLowerCase();
    void performSearch(formattedKey);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 pb-10 font-sans text-gray-900 dark:text-gray-100">
      <Header
        inputEventKey={inputEventKey}
        onInputChange={setInputEventKey}
        onSearchSubmit={handleSearchSubmit}
        searchStatus={searchStatus}
      />

      <div className="mx-auto mt-6 max-w-4xl px-5">
        {searchStatus === "success" && (
          <>
            <EventInfoBar eventKey={activeEventKey} teamCount={teams.length} />

            <CurrentMatchStatus
              currentMatch={currentGlobalMatch}
              isFutureEvent={isFutureEvent}
              allMatchesCount={allMatches.length}
            />

            <SectionTitle isEventOver={isEventOver} />

            {isEventOver ? (
              <FinalResults teamRank={teamRank} />
            ) : (
              <>
                {targetTeamMatches.length === noGap && (
                  <EmptyState isTeamDone={isTeamDone} />
                )}

                {targetTeamMatches.map((match) => (
                  <MatchCard
                    key={match.key}
                    match={match}
                    teamNameMap={teamNameMap}
                    futureMatches={futureMatches}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
