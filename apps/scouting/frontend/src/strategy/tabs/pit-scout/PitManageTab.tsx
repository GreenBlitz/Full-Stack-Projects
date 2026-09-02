import type { PitScout } from "@repo/scouting_types";
import { useEffect, useState } from "react";
import { LuPen } from "react-icons/lu";
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pit Data</h1>

      <table className="text-xl w-full min-w-max text-left border-collapse">
        <thead>
          <tr>
            <th>Team Number</th>
            <th>Has Turret</th>
            <th>Can Pass Trench</th>
            <th>Extra Info</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {data.map((pitScout) => (
            <tr key={pitScout.teamNumber}>
              <td>{pitScout.teamNumber}</td>
              <td>{pitScout.booleanMetrics.hasTurret ? "Yes" : "No"}</td>
              <td>{pitScout.booleanMetrics.canPassTrench ? "Yes" : "No"}</td>
              <td>{pitScout.extraInfo}</td>
              <td>
                <button onClick={() => openEditModal(pitScout)}>
                  <LuPen className="text-xl text-slate-400 hover:text-emerald-400 transition-colors" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
