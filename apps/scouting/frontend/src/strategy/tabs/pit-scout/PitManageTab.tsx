import type { PitScout } from "@repo/scouting_types";
import { useEffect, useState } from "react";
import { LuCircleCheck, LuCircleX, LuMinus, LuPen } from "react-icons/lu";
import { PitEditModal } from "./PitEditModal";
import { PIT_SCOUT_URL } from "./PitScoutTab";

const fetchPitData = async (): Promise<PitScout[]> => {
  const response = await fetch(PIT_SCOUT_URL);
  if (!response.ok) {
    throw new Error("Failed to load pit data");
  }
  return response.json();
};

export const PitManageTab = () => {
  const [data, setData] = useState<PitScout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPitData, setSelectedPitData] = useState<PitScout | null>(null);

  useEffect(() => {
    fetchPitData()
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const openEditModal = (pitScout: PitScout) => {
    setModalOpen(true);
    setSelectedPitData(pitScout);
  };

  const refreshData = async () => {
    setData(await fetchPitData());
  };

  const Capability = ({ value }: { value: boolean | undefined }) => {
    if (value === undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <LuMinus className="h-3.5 w-3.5" />
          Unknown
        </span>
      );
    }

    return value ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
        <LuCircleCheck className="h-4 w-4" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300">
        <LuCircleX className="h-4 w-4" />
        No
      </span>
    );
  };

  return (
    <div className="pb-12 text-slate-200">
      <h1 className="mb-6 text-3xl font-black pt-5 text-center tracking-tight text-white">
        Pit Scout Management
      </h1>

      <div className="overflow-x-auto border border-white/10 bg-slate-900/45 shadow-2xl shadow-black/20">
        <table className="w-full min-w-180 text-left">
          <thead className="bg-slate-950/70 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Team Number</th>
              <th className="px-5 py-4">Has Turret</th>
              <th className="px-5 py-4">Can Pass Trench</th>
              <th className="px-5 py-4">Extra Info</th>
              <th className="px-5 py-4 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm font-bold text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <LuCircleX className="h-10 w-10" />
                    No pit data yet
                  </div>
                </td>
              </tr>
            ) : (
              data.map((pitScout) => (
                <tr
                  key={pitScout.teamNumber}
                  className="transition-colors hover:bg-emerald-500/4"
                >
                  <td className="px-5 py-5 font-mono text-lg font-black text-white">
                    {pitScout.teamNumber}
                  </td>
                  <td className="px-5 py-5">
                    <Capability value={pitScout.booleanMetrics.hasTurret} />
                  </td>
                  <td className="px-5 py-5">
                    <Capability value={pitScout.booleanMetrics.canPassTrench} />
                  </td>
                  <td className="max-w-sm px-5 py-5 text-sm text-slate-400">
                    <span className="block truncate">
                      {pitScout.extraInfo || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-right">
                    <button
                      onClick={() => openEditModal(pitScout)}
                      title={`Edit team ${pitScout.teamNumber}`}
                      className="inline-flex rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"
                    >
                      <LuPen className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPitData && (
        <PitEditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refreshData}
          pitData={selectedPitData}
        />
      )}
    </div>
  );
};
