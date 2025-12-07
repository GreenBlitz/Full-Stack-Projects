// בס"ד


import type React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { urlMatches, type MatchesSimpleType } from "./endpoints/MatchSimple";
import { urlTeamsInEvent, type TeamsInEventType } from "./endpoints/TeamsSimple";

const targetTeamNumber = 4590;
const targetTeamKey = `frc${targetTeamNumber}`;
const backendPort = 4590;
const refreshIntervalMs = 30000;
const timeMultiplier = 1000;
const sliceStart = 3;
const firstIndex = 0;
const nextMatchLimit = 2;
const noGap = 0;
const matchTime = 0;
const dayInSeconds = 86400;
const backendBaseUrl = `http://localhost:${backendPort}/fetch?url=`;

const colorRedBg = "#FFEBEE";
const colorRedBorder = "#EF5350";
const colorRedText = "#C62828";
const colorBlueBg = "#E3F2FD";
const colorBlueBorder = "#42A5F5";
const colorBlueText = "#1565C0";
const colorNeutralBg = "#f5f5f5";
const colorCardBg = "#ffffff";
const colorHeaderBg = "#263238";
const colorTextMain = "#333333";
const colorTextSub = "#666666";
const colorAccent = "#FFA000";
const colorFuture = "#2196F3";
const colorButtonBg = "#00E676";
const colorButtonText = "#1B5E20";
const colorRankBg = "#E8EAF6";
const colorRankText = "#3F51B5";

interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

interface RankItem {
  rank: number;
  team_key: string;
  record: TeamRecord;
}

interface RankingsResponse {
  rankings: RankItem[];
}

const urlRankings = (eventKey: string) => 
  `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`;

const fetchFromProxy = async <T,>(targetUrl: string): Promise<T> => {
  const fullUrl = `${backendBaseUrl}${encodeURIComponent(targetUrl)}`;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

const App: React.FC = () => {
  const [inputEventKey, setInputEventKey] = useState<string>("");
  const [activeEventKey, setActiveEventKey] = useState<string>("");
  const [teams, setTeams] = useState<TeamsInEventType[]>([]);
  const [allMatches, setAllMatches] = useState<MatchesSimpleType[]>([]);
  const [teamRank, setTeamRank] = useState<RankItem | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const performSearch = useCallback(async (eventKey: string) => {
    if (!eventKey) return;
    
    setSearchStatus("loading");
    setActiveEventKey("");
    setAllMatches([]);
    setTeams([]);
    setTeamRank(null);

    try {
      const teamsUrl = urlTeamsInEvent(eventKey);
      const matchesUrl = urlMatches(eventKey);
      const rankingsUrl = urlRankings(eventKey);

      const [teamsData, matchesData, rankingsData] = await Promise.all([
        fetchFromProxy<TeamsInEventType[]>(teamsUrl),
        fetchFromProxy<MatchesSimpleType[]>(matchesUrl),
        fetchFromProxy<RankingsResponse>(rankingsUrl).catch(() => ({ rankings: [] }))
      ]);

      if (Array.isArray(teamsData) && Array.isArray(matchesData)) {
        setTeams(teamsData);
        matchesData.sort((a, b) => (a.predicted_time ?? a.time ?? noGap) - (b.predicted_time ?? b.time ?? noGap));
        setAllMatches(matchesData);
        
        const myRank = rankingsData.rankings.find(r => r.team_key === targetTeamKey) ?? null;
        setTeamRank(myRank);

        setActiveEventKey(eventKey);
        setSearchStatus("success");
      } else {
        setSearchStatus("error");
      }
    } catch {
      setSearchStatus("error");
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedKey = inputEventKey.trim().toLowerCase();
    void performSearch(formattedKey);
  };

  useEffect(() => {
    let intervalId: number | undefined = undefined;

    if (searchStatus === "success" && activeEventKey) {
      intervalId = window.setInterval(() => {
        const matchesUrl = urlMatches(activeEventKey);
        void fetchFromProxy<MatchesSimpleType[]>(matchesUrl).then(data => {
           if (Array.isArray(data)) {
             data.sort((a, b) => (a.predicted_time ?? a.time ?? noGap) - (b.predicted_time ?? b.time ?? noGap));
             setAllMatches(data);
           }
        }).catch(console.error);
      }, refreshIntervalMs);
    }

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeEventKey, searchStatus]);

  const teamNameMap = useMemo(() => {
    const map: Map<string, string> = new Map();
    teams.forEach(t => map.set(t.key, t.nickname));
    return map;
  }, [teams]);

  const { currentGlobalMatch, targetTeamMatches, isEventOver, isTeamDone, isFutureEvent } = useMemo(() => {
    
//     testing 2025isios
//   const currentTimeSecs = Math.floor(new Date("2025-10-08T10:44:00").getTime() / timeMultiplier);
//     testing 2025iscmp
//     const currentTimeSecs = Math.floor(new Date("2025-03-26T17:00:00").getTime() / timeMultiplier);
//     normal one
    const currentTimeSecs = Math.floor(Date.now() / timeMultiplier);


    const getMatchTime = (m: MatchesSimpleType) => m.predicted_time ?? m.time ?? matchTime;

    const futureMatches = allMatches.filter(m => {
        const t = getMatchTime(m);
        return t > noGap && t > currentTimeSecs;
    });

    const pastMatches = allMatches.filter(m => {
        const t = getMatchTime(m);
        return t > noGap && t <= currentTimeSecs;
    });

    const currentMatch = futureMatches.length > noGap 
      ? futureMatches[firstIndex] 
      : undefined;

    const teamFutureMatches = futureMatches.filter(m => 
      m.alliances.blue.team_keys.includes(targetTeamKey) || 
      m.alliances.red.team_keys.includes(targetTeamKey)
    );

    const teamPastMatches = pastMatches.filter(m => 
      m.alliances.blue.team_keys.includes(targetTeamKey) || 
      m.alliances.red.team_keys.includes(targetTeamKey)
    );

    const hasEventEnded = futureMatches.length === noGap && allMatches.length > noGap;
    const hasTeamDone = !hasEventEnded && teamFutureMatches.length === noGap && teamPastMatches.length > noGap;
    
    let isItFutureEvent = false;
    if (currentMatch) {
      const t = getMatchTime(currentMatch);
      if (t > currentTimeSecs + dayInSeconds) {
        isItFutureEvent = true;
      }
    }

    return {
      currentGlobalMatch: currentMatch,
      targetTeamMatches: hasTeamDone ? [] : teamFutureMatches.slice(firstIndex, nextMatchLimit),
      isEventOver: hasEventEnded,
      isTeamDone: hasTeamDone,
      isFutureEvent: isItFutureEvent
    };
  }, [allMatches]);

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: colorNeutralBg, minHeight: "100vh", paddingBottom: "40px" }}>
      
      <div style={{ backgroundColor: colorHeaderBg, color: "white", padding: "20px 0", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ margin: "0 0 15px 0", fontSize: "1.8rem" }}>FRC Dashboard</h1>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              placeholder="Event ID (e.g., 2025isios)" 
              value={inputEventKey}
              onChange={(e) => { setInputEventKey(e.target.value); }}
              style={{ padding: "12px", fontSize: "16px", flexGrow: 1, border: "none", borderRadius: "6px", outline: "none" }}
            />
            <button 
              type="submit" 
              disabled={searchStatus === "loading"}
              style={{ padding: "12px 25px", fontSize: "16px", backgroundColor: colorButtonBg, color: colorButtonText, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {searchStatus === "loading" ? "..." : "Load"}
            </button>
          </form>

          {searchStatus === "error" && (
            <div style={{ marginTop: "15px", padding: "10px", backgroundColor: colorRedBg, color: colorRedText, borderRadius: "4px", fontSize: "0.9rem" }}>
              Event not found.
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto", padding: "0 20px" }}>
        {searchStatus === "success" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", color: colorTextSub, fontSize: "0.9rem" }}>
              <span><strong>Event:</strong> {activeEventKey}</span>
              <span><strong>Teams:</strong> {teams.length}</span>
            </div>

            <div style={{ backgroundColor: colorCardBg, padding: "20px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: `5px solid ${isFutureEvent ? colorFuture : colorAccent}` }}>
              <h2 style={{ margin: "0 0 5px 0", fontSize: "1rem", color: isFutureEvent ? colorFuture : colorAccent, textTransform: "uppercase", letterSpacing: "1px" }}>
                {isFutureEvent ? "Upcoming Event" : "Current Field Status"}
              </h2>
              {currentGlobalMatch !== undefined ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "2rem", fontWeight: "800", color: colorTextMain }}>
                    {currentGlobalMatch.comp_level.toUpperCase()}-{currentGlobalMatch.match_number}
                  </span>
                  <span style={{ padding: "5px 12px", backgroundColor: isFutureEvent ? "#E3F2FD" : "#FFF3E0", color: isFutureEvent ? colorFuture : "#E65100", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>
                    {isFutureEvent ? "SCHEDULED" : "IN PROGRESS"}
                  </span>
                </div>
              ) : (
                <p style={{ color: "#999", fontStyle: "italic" }}>{allMatches.length > noGap ? "Event Concluded" : "No matches scheduled"}</p>
              )}
            </div>

            <h2 style={{ fontSize: "1.4rem", color: colorTextMain, borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
              {isEventOver ? `Final Results: Team ${targetTeamNumber}` : `Upcoming: Team ${targetTeamNumber}`}
            </h2>
            
            {isEventOver ? (
              <div style={{ backgroundColor: colorCardBg, borderRadius: "12px", padding: "30px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                {teamRank ? (
                   <>
                     <div style={{ fontSize: "1rem", color: colorTextSub, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Final Rank</div>
                     <div style={{ fontSize: "4rem", fontWeight: "bold", color: colorRankText, lineHeight: "1" }}>#{teamRank.rank}</div>
                     <div style={{ marginTop: "20px", display: "inline-block", backgroundColor: colorRankBg, padding: "8px 20px", borderRadius: "20px", color: colorRankText, fontWeight: "bold" }}>
                       Record: {teamRank.record.wins}-{teamRank.record.losses}-{teamRank.record.ties}
                     </div>
                   </>
                ) : (
                   <p style={{ color: colorTextSub, fontStyle: "italic" }}>Rank data not available for this event.</p>
                )}
              </div>
            ) : (
              <>
                {targetTeamMatches.length === noGap && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#888", backgroundColor: colorCardBg, borderRadius: "12px" }}>
                    {isTeamDone 
                      ? <p>Team {targetTeamNumber} has completed all scheduled matches for this event (or for today).</p>
                      : <p>No upcoming matches found for Team {targetTeamNumber}.</p>
                    }
                  </div>
                )}

                {targetTeamMatches.map((match) => {
                  const effectiveTime = match.predicted_time ?? match.time;
                  const predictedDate = effectiveTime 
                    ? new Date(effectiveTime * timeMultiplier).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : "TBD";

                  let matchesAway = noGap;
                  if (currentGlobalMatch !== undefined && match.comp_level === currentGlobalMatch.comp_level) {
                    matchesAway = match.match_number - currentGlobalMatch.match_number;
                  }

                  const isRedAlliance = match.alliances.red.team_keys.includes(targetTeamKey);

                  return (
                    <div key={match.key} style={{ 
                      backgroundColor: colorCardBg, 
                      borderRadius: "12px", 
                      marginBottom: "20px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      overflow: "hidden"
                    }}>
                      <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafafa" }}>
                        <div>
                          <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: colorTextMain }}>
                            {match.comp_level.toUpperCase()} - {match.match_number}
                          </span>
                        </div>
                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <div style={{ fontSize: "0.9rem", color: colorTextSub, display: "flex", alignItems: "center", gap: "10px" }}>
                            {predictedDate}
                          </div>
                          
                          <div style={{ color: matchesAway <= nextMatchLimit ? colorRedText : colorTextSub, fontWeight: "bold", fontSize: "0.85rem", marginTop: "4px" }}>
                              {matchesAway <= noGap ? "PLAYING NOW" : `IN ${matchesAway} MATCHES`}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex" }}>
                        <div style={{ flex: 1, backgroundColor: isRedAlliance ? colorRedBg : colorCardBg, borderTop: `4px solid ${colorRedBorder}`, padding: "15px" }}>
                          <div style={{ color: colorRedText, fontWeight: "bold", marginBottom: "10px", fontSize: "0.9rem", textTransform: "uppercase" }}>Red Alliance</div>
                          {match.alliances.red.team_keys.map(key => {
                            const num = key.slice(sliceStart);
                            const name = teamNameMap.get(key) ?? "Unknown";
                            const isMe = key === targetTeamKey;
                            return (
                              <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: "6px", fontWeight: isMe ? "bold" : "normal" }}>
                                <span style={{ width: "50px", fontWeight: "bold", color: colorTextMain }}>{num}</span>
                                <span style={{ fontSize: "0.9rem", color: colorTextSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                                {isMe && <span style={{ marginLeft: "auto", fontSize: "0.7rem", backgroundColor: colorRedText, color: "white", padding: "2px 6px", borderRadius: "4px" }}>YOU</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ flex: 1, backgroundColor: !isRedAlliance ? colorBlueBg : colorCardBg, borderTop: `4px solid ${colorBlueBorder}`, padding: "15px", borderLeft: "1px solid #eee" }}>
                          <div style={{ color: colorBlueText, fontWeight: "bold", marginBottom: "10px", fontSize: "0.9rem", textTransform: "uppercase" }}>Blue Alliance</div>
                          {match.alliances.blue.team_keys.map(key => {
                            const num = key.slice(sliceStart);
                            const name = teamNameMap.get(key) ?? "Unknown";
                            const isMe = key === targetTeamKey;
                            return (
                              <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: "6px", fontWeight: isMe ? "bold" : "normal" }}>
                                <span style={{ width: "50px", fontWeight: "bold", color: colorTextMain }}>{num}</span>
                                <span style={{ fontSize: "0.9rem", color: colorTextSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                                {isMe && <span style={{ marginLeft: "auto", fontSize: "0.7rem", backgroundColor: colorBlueText, color: "white", padding: "2px 6px", borderRadius: "4px" }}>YOU</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;