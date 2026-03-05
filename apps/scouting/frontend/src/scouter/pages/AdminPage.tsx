import { useState, useEffect } from "react";
import type { ScoutingForm } from "@repo/scouting_types";
import { PreMatchTab } from "./tabs/PreMatchTab";
import { ShiftTab } from "./tabs/ShiftTab";
import { ClimbTab } from "./tabs/ClimbTab";
import { PostMatchTab } from "./tabs/PostMatchTab";
import BpsBase from "../components/bps-components/BpsBase";

const AdminPage: React.FC = () => {
  const [forms, setForms] = useState<(ScoutingForm & { _id: string })[]>([]);
  const [editingForm, setEditingForm] = useState<(ScoutingForm & { _id: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<"scouting" | "bps">("scouting");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/forms");
      const data = await res.json();
      setForms(data.forms);
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    if (!editingForm) return;
    setSaveError(null);
    try {
      const { _id, ...formData } = editingForm;
      const res = await fetch(`/api/v1/forms/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${res.status}: ${errorText}`);
      }
      setEditingForm(null);
      await fetchForms();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveError(message);
      console.error("Failed to save form:", err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-200 mb-6">Manage Forms</h1>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="text-black px-4 py-2 text-left">Scouter</th>
                <th className="text-black px-4 py-2 text-left">Team</th>
                <th className="text-black px-4 py-2 text-left">Match</th>
                <th className="text-black px-4 py-2 text-left">Type</th>
                <th className="text-black px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form._id} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="px-4 py-3">{form.scouterName}</td>
                  <td className="px-4 py-3">{form.teamNumber}</td>
                  <td className="px-4 py-3">{form.match.number}</td>
                  <td className="px-4 py-3">{form.match.type}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingForm(form)}
                      className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingForm && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Form</h2>
              
              {saveError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {saveError}
                </div>
              )}

              {/* Main tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMainTab("scouting")}
                  className={`px-4 py-2 font-medium ${
                    mainTab === "scouting"
                      ? "border-b-2 border-gray-700 text-gray-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Scouting
                </button>
                <button
                  onClick={() => setMainTab("bps")}
                  className={`px-4 py-2 font-medium ${
                    mainTab === "bps"
                      ? "border-b-2 border-gray-700 text-gray-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  BPS
                </button>
              </div>

              {mainTab === "scouting" && (
                <>
                  {/* Scouting sub-tabs */}
                  <div className="flex gap-2 mb-6 border-b">
                    <button
                      onClick={() => setActiveTab(0)}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 0
                          ? "border-b-2 border-gray-700 text-gray-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Pre
                    </button>
                    <button
                      onClick={() => setActiveTab(1)}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 1
                          ? "border-b-2 border-gray-700 text-gray-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => setActiveTab(2)}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 2
                          ? "border-b-2 border-gray-700 text-gray-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Climb
                    </button>
                    <button
                      onClick={() => setActiveTab(3)}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 3
                          ? "border-b-2 border-gray-700 text-gray-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Tele
                    </button>
                    <button
                      onClick={() => setActiveTab(4)}
                      className={`px-4 py-2 font-medium ${
                        activeTab === 4
                          ? "border-b-2 border-gray-700 text-gray-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </>
                )}

              {/* Tab Content */}
              <div className="mb-6 max-h-64 overflow-y-auto">
                {mainTab === "scouting" && (
                  <>
                    {activeTab === 0 && editingForm && (
                      <PreMatchTab
                        currentForm={editingForm as any}
                        setForm={(newForm) => {
                          const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                          setEditingForm({ ...updated, _id: editingForm._id } as any);
                        }}
                        alliance="red"
                        originTime={0}
                      />
                    )}
                    {activeTab === 1 && editingForm && (
                      <ShiftTab
                        currentForm={editingForm as any}
                        setForm={(newForm) => {
                          const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                          setEditingForm({ ...updated, _id: editingForm._id } as any);
                        }}
                        alliance="red"
                        originTime={0}
                        shiftType="auto"
                        tabIndex={0}
                      />
                    )}
                    {activeTab === 2 && editingForm && (
                      <ClimbTab
                        currentForm={editingForm as any}
                        setForm={(newForm) => {
                          const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                          setEditingForm({ ...updated, _id: editingForm._id } as any);
                        }}
                        alliance="red"
                        originTime={0}
                        isAuto={false}
                      />
                    )}
                    {activeTab === 3 && editingForm && (
                      <>
                        <ShiftTab
                          currentForm={editingForm as any}
                          setForm={(newForm) => {
                            const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                            setEditingForm({ ...updated, _id: editingForm._id } as any);
                          }}
                          alliance="red"
                          originTime={0}
                          shiftType="transition"
                          tabIndex={0}
                        />
                        <div className="mt-4 border-t pt-4">
                          <ShiftTab
                            currentForm={editingForm as any}
                            setForm={(newForm) => {
                              const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                              setEditingForm({ ...updated, _id: editingForm._id } as any);
                            }}
                            alliance="red"
                            originTime={0}
                            shiftType="endgame"
                            tabIndex={0}
                          />
                        </div>
                      </>
                    )}
                    {activeTab === 4 && editingForm && (
                      <PostMatchTab
                        currentForm={editingForm as any}
                        setForm={(newForm) => {
                          const updated = typeof newForm === "function" ? newForm(editingForm) : newForm;
                          setEditingForm({ ...updated, _id: editingForm._id } as any);
                        }}
                        alliance="red"
                        originTime={0}
                      />
                    )}
                  </>
                )}
                {mainTab === "bps" && <BpsBase />}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveForm}
                  className="bg-gray-700 text-white px-4 py-2 rounded font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingForm(null)}
                  className="bg-gray-700 text-white px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;