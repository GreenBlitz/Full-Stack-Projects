// בס"ד
import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  performSearch: (eventKey: string) => void;
  resetSearch: () => void;
}

export const useEventData = (
  activeEventKey: string,
  setActiveEventKey: (key: string) => void
): UseEventDataReturn => {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams", activeEventKey],
    queryFn: async () =>
      fetchFromProxy<TeamsInEventType[]>(urlTeamsInEvent(activeEventKey)),
    enabled: !!activeEventKey,
    staleTime: Infinity,
  });

  const matchesQuery = useQuery({
    queryKey: ["matches", activeEventKey],
    queryFn: async () => {
      const data = await fetchFromProxy<MatchesSimpleType[]>(
        urlMatches(activeEventKey)
      );
      if (Array.isArray(data)) {
        data.sort(sortMatches);
      }
      return data;
    },
    enabled: !!activeEventKey,
    refetchInterval: refreshIntervalMs,
  });

  const rankingsQuery = useQuery({
    queryKey: ["rankings", activeEventKey],
    queryFn: async () =>
      fetchFromProxy<RankingsResponse>(urlRankings(activeEventKey)).catch(
        () => ({
          rankings: [],
        })
      ),
    enabled: !!activeEventKey,
    refetchInterval: refreshIntervalMs,
  });

  const alliancesQuery = useQuery({
    queryKey: ["alliances", activeEventKey],
    queryFn: async () =>
      fetchFromProxy<AllianceSimpleType[]>(urlAlliances(activeEventKey)).catch(
        () => []
      ),
    enabled: !!activeEventKey,
    staleTime: Infinity,
  });

  const resetSearch = useCallback(() => {
    setActiveEventKey("");
    queryClient.removeQueries({ queryKey: ["teams"] });
    queryClient.removeQueries({ queryKey: ["matches"] });
    queryClient.removeQueries({ queryKey: ["rankings"] });
    queryClient.removeQueries({ queryKey: ["alliances"] });
  }, [setActiveEventKey, queryClient]);

  const performSearch = useCallback(
    (eventKey: string) => {
      if (!eventKey) return;
      setActiveEventKey(eventKey);
      // We don't need to await here because React Query handles the loading state
    },
    [setActiveEventKey]
  );

  const queries = [teamsQuery, matchesQuery, rankingsQuery, alliancesQuery];

  let searchStatus: SearchStatus = "idle";
  if (activeEventKey) {
    if (queries.some((q) => q.isError)) {
      searchStatus = "error";
    } else if (queries.some((q) => q.isLoading)) {
      searchStatus = "searching";
    } else if (queries.every((q) => q.isSuccess)) {
      searchStatus = "success";
    }
  }

  const teamRank =
    rankingsQuery.data?.rankings.find((r) => r.team_key === targetTeamKey) ??
    null;

  return {
    teams: teamsQuery.data ?? [],
    allMatches: matchesQuery.data ?? [],
    alliances: alliancesQuery.data ?? [],
    teamRank,
    searchStatus,
    performSearch,
    resetSearch,
  };
};
