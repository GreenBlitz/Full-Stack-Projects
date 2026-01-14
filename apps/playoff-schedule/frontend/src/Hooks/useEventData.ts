// בס"ד
import { useState, useCallback, useEffect } from "react";
import { urlMatches, type MatchesSimpleType } from "../endpoints/MatchSimple";
import {
  urlTeamsInEvent,
  type TeamsInEventType,
} from "../endpoints/TeamsSimple";
import { urlRankings } from "../utils/rankingsUtils";
import {
  urlAlliances,
  type AllianceSimpleType,
} from "../endpoints/AlliancesSimple";
import { fetchFromProxy } from "../utils/apiUtils";
import { sortMatches } from "../utils/matchUtils";
import type { RankItem, RankingsResponse } from "../types";
import { targetTeamKey, refreshIntervalMs } from "../config/frcConfig";

export type SearchStatus = "idle" | "searching" | "success" | "error";

interface UseEventDataReturn {
  teams: TeamsInEventType[];
  allMatches: MatchesSimpleType[];
  alliances: AllianceSimpleType[];
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
  const [alliances, setAlliances] = useState<AllianceSimpleType[]>([]);
  const [teamRank, setTeamRank] = useState<RankItem | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");

  const resetSearch = useCallback(() => {
    setSearchStatus("searching");
    setAllMatches([]);
    setTeams([]);
    setAlliances([]);
    setTeamRank(null);
  }, []);

  const fetchEventData = useCallback(async (eventKey: string) => {
    const teamsUrl = urlTeamsInEvent(eventKey);
    const matchesUrl = urlMatches(eventKey);
    const rankingsUrl = urlRankings(eventKey);
    const alliancesUrl = urlAlliances(eventKey);

    return Promise.all([
      fetchFromProxy<TeamsInEventType[]>(teamsUrl),
      fetchFromProxy<MatchesSimpleType[]>(matchesUrl),
      fetchFromProxy<RankingsResponse>(rankingsUrl).catch(() => ({
        rankings: [],
      })),
      fetchFromProxy<AllianceSimpleType[]>(alliancesUrl).catch(() => []),
    ]);
  }, []);

  const performSearch = useCallback(
    async (eventKey: string) => {
      if (!eventKey) return;

      resetSearch();
      setActiveEventKey(eventKey);

      try {
        const [teamsData, matchesData, rankingsData, alliancesData] =
          await fetchEventData(eventKey);

        if (!Array.isArray(teamsData) || !Array.isArray(matchesData)) {
          setSearchStatus("error");
          return;
        }
        setTeams(teamsData);
        matchesData.sort(sortMatches);
        setAllMatches(matchesData);
        setAlliances(Array.isArray(alliancesData) ? alliancesData : []);
        setTeamRank(
          rankingsData.rankings.find((r) => r.team_key === targetTeamKey) ??
            null
        );
        setSearchStatus("success");
      } catch {
        setSearchStatus("error");
      }
    },
    [setActiveEventKey, resetSearch, fetchEventData]
  );

  useEffect(() => {
    if (activeEventKey && searchStatus === "idle") {
      void performSearch(activeEventKey);
    }
  }, [activeEventKey, performSearch, searchStatus]);

  useEffect(() => {
    if (!(searchStatus === "success" && activeEventKey)) {
      return undefined;
    }

    const intervalId = setInterval(() => {
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
            data.rankings.find(
              (ranking) => ranking.team_key === targetTeamKey
            ) ?? null;
          setTeamRank(myRank);
        })
        .catch(console.error);
    }, refreshIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeEventKey, searchStatus]);

  return {
    teams,
    allMatches,
    alliances,
    teamRank,
    searchStatus,
    performSearch,
    resetSearch,
  };
};
