// בס"ד
import { useState, type FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocalStorage } from "@repo/local_storage_hook";
import { type ScoutingForm, scoutingFormSerde } from "@repo/scouting_types";
import { serialize } from "@repo/serde";
import { LuQrCode } from "react-icons/lu";
import { MdFileUpload } from "react-icons/md";
import { IoIosRemoveCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { isEmpty } from "@repo/array-functions";
import { useNavigate } from "react-router-dom";

const ICON_SIZE = 20;

// level of extra data used for error correction
// medium uses around 15% of data
const ERROR_CORRECTION_LEVEL: "L" | "M" | "Q" | "H" = "M";

const decoder = new TextDecoder("utf-8");
export const ScoutedMatches: FC = () => {
  const [scoutedMatches, setScoutedMatches] = useLocalStorage<ScoutingForm[]>(
    "scouted_forms",
    [],
  );
  const [selectedMatch, setSelectedMatch] = useState<ScoutingForm>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const removeMatch = (index: number) => {
    setScoutedMatches((prev) =>
      prev.filter((item, matchIndex) => matchIndex !== index),
    );
  };

  const submitMatch = async (form: ScoutingForm, index: number) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/forms/single", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        removeMatch(index);
      }
    } catch (error: unknown) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/forms/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoutedMatches),
      });
      if (response.ok) {
        setScoutedMatches([]);
      }
    } catch (error: unknown) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="text-8xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {isEmpty(scoutedMatches) ? (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-8xl">No Matches Scouted 😱</h1>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-screen">
          {scoutedMatches.map((match, index) => (
            <div
              key={index}
              className="bg-zinc-900 shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-xl p-5 border 
            border-gray-100 dark:border-gray-700 cursor-pointer transition-transform hover:scale-[1.02] h-26"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    {match.match.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Match #{match.match.number}
                  </h3>
                </div>
                <div className="flex flex-row">
                  <div
                    onClick={() => {
                      removeMatch(index);
                    }}
                    className="h-min my-auto mx-2 bg-red-800 p-2 rounded-2xl"
                  >
                    <IoIosRemoveCircle size={ICON_SIZE} />
                  </div>
                  <div
                    onClick={() => {
                      void submitMatch(match, index);
                    }}
                    className="h-min my-auto mx-2 bg-green-600 p-2 rounded-2xl"
                  >
                    <MdFileUpload size={ICON_SIZE} />
                  </div>
                  <div
                    onClick={() => {
                      setSelectedMatch(match);
                    }}
                    className="bg-slate-600 p-2 rounded-2xl mx-2"
                  >
                    <LuQrCode size={ICON_SIZE} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {selectedMatch && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2"
              onClick={() => {
                setSelectedMatch(undefined);
              }}
            >
              <div
                className="bg-zinc-900 border-2 border-emerald-800 rounded-xl p-3 max-w-lg w-full flex flex-row items-center gap-4 shadow-2xl"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div className="p-2 bg-white rounded-lg shrink-0 border border-gray-100">
                  <QRCodeSVG
                    size={160}
                    value={decoder.decode(
                      serialize(scoutingFormSerde.serializer, selectedMatch),
                    )}
                    level={ERROR_CORRECTION_LEVEL}
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="mb-2">
                    <h2 className="text-lg uppercase font-bold truncate">
                      {selectedMatch.match.type} #{selectedMatch.match.number}
                    </h2>
                    <p className="text-xs text-gray-500 leading-tight">
                      Scan to transfer scout data
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMatch(undefined);
                    }}
                    className="mt-2 w-full py-2 bg-zinc-800 text-sm font-semibold rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="w-32 p-4 flex flex-col">
        <button
          className="scouter-navigation-button w-full h-12"
          onClick={() => {
            void navigate("/scout");
          }}
        >
          Scout
        </button>
        <button
          className="bg-linear-to-r from-green-700 to-green-800 shadow-[0_0_15px_rgba(34,250,94,0.4)] w-full h-12 mt-auto"
          onClick={() => {
            void submitAll();
          }}
        >
          Submit All
        </button>
      </div>
    </div>
  );
};
