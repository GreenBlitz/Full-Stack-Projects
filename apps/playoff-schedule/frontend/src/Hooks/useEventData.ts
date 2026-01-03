// בס"ד
import { useState, useCallback, useEffect } from "react";
import { urlMatches, type MatchesSimpleType } from "../endpoints/MatchSimple";
import {
  urlTeamsInEvent,
  type TeamsInEventType,
} from "../endpoints/TeamsSimple";
import { urlRankings } from "../utils/rankingsUtils";
import { fetchFromProxy } from "../utils/apiUtils";
import { sortMatches } from "../utils/matchUtils";
import type { RankItem, RankingsResponse } from "../types";
import { targetTeamKey, refreshIntervalMs } from "../config/frcConfig";

type SearchStatus = "idle" | "searching" | "success" | "error";

interface UseEventDataReturn {
  teams: TeamsInEventType[];
  allMatches: MatchesSimpleType[];
  teamRank: RankItem | null;
  searchStatus: SearchStatus;
  performSearch: (eventKey: string) => Promise<void>;
  resetSearch: () => void;
}

export const useEventData = (
  activeEventKey: string,
  setActiveEventKey: (key: string) => void
): UseEventDataReturn => {
  const [teams, setTeams] = useState<TeamsInEventType[]>([]);
  const [allMatches, setAllMatches] = useState<MatchesSimpleType[]>([]);
  const [teamRank, setTeamRank] = useState<RankItem | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");

  const resetSearch = useCallback(() => {
    setSearchStatus("searching");
    setAllMatches([]);
    setTeams([]);
    setTeamRank(null);
  }, []);

  const performSearch = useCallback(
    async (eventKey: string) => {
      if (!eventKey) return;

      resetSearch();
      setActiveEventKey(eventKey);

      try {
        const teamsUrl = urlTeamsInEvent(eventKey);
        const matchesUrl = urlMatches(eventKey);
        const rankingsUrl = urlRankings(eventKey);

        const [teamsData, matchesData, rankingsData] = await Promise.all([
          fetchFromProxy<TeamsInEventType[]>(teamsUrl),
          fetchFromProxy<MatchesSimpleType[]>(matchesUrl),
          fetchFromProxy<RankingsResponse>(rankingsUrl).catch(() => ({
            rankings: [],
          })),
        ]);

        if (Array.isArray(teamsData) && Array.isArray(matchesData)) {
          setTeams(teamsData);
          matchesData.sort(sortMatches);
          setAllMatches(matchesData);
          setTeamRank(
            rankingsData.rankings.find((r) => r.team_key === targetTeamKey) ??
              null
          );
          setSearchStatus("success");
        } else {
          setSearchStatus("error");
        }
      } catch {
        setSearchStatus("error");
      }
    },
    [setActiveEventKey, resetSearch]
  );

  useEffect(() => {
    if (activeEventKey && searchStatus === "idle") {
      void performSearch(activeEventKey);
    }
  }, [activeEventKey, performSearch, searchStatus]);

  useEffect(() => {
    const intervalId: number | undefined =
      searchStatus === "success" && activeEventKey
        ? window.setInterval(() => {
            const matchesUrl = urlMatches(activeEventKey);
            const rankingsUrl = urlRankings(activeEventKey);

            void fetchFromProxy<MatchesSimpleType[]>(matchesUrl)
              .then((data) => {
                if (Array.isArray(data)) {
                  data.sort(sortMatches);
                  setAllMatches(data);
                }
              })
              .catch(console.error);

            void fetchFromProxy<RankingsResponse>(rankingsUrl)
              .then((data) => {
                const myRank =
                  data.rankings.find((r) => r.team_key === targetTeamKey) ??
                  null;
                setTeamRank(myRank);
              })
              .catch(console.error);
          }, refreshIntervalMs)
        : undefined;

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [activeEventKey, searchStatus]);

  return {
    teams,
    allMatches,
    teamRank,
    searchStatus,
    performSearch,
    resetSearch,
  };
};
