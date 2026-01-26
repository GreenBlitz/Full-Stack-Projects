// בס"ד
import type { FC } from "react";
import type { TabProps } from "../ScoutMatch";
import type { ScoutingForm} from "@repo/scouting_types";
import { useLocalStorage } from "@repo/local_storage_hook";
import { createNewScoutingForm } from "../ScoutMatch";

export const PostMatchTab: FC<TabProps> = ({ setForm, currentForm }) => {
  const [scoutingForms, setScoutingForms] = useLocalStorage<ScoutingForm[]>(
    "forms",
    [],
  );

  const handleSubmit = () => {
    setForm(createNewScoutingForm());
    setScoutingForms((prev) => [...prev, currentForm]);
  };
  const handleText = (message:string) => {
    setForm((prev) => ({
      ...prev,
      comment: message,
    }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label 
            htmlFor="match-comments" 
            className="text-lg font-bold text-emerald-400"
          >
            Match Comments
          </label>
          <textarea
            id="match-comments"
            onChange={(event) => { handleText(event.target.value); }}
            placeholder="Add any additional notes or observations about this match..."
            className="w-full flex-1 p-4 text-base border-2 border-green-500/30 rounded-xl 
                     bg-[#1a1a1a] text-green-100
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                     placeholder:text-emerald-500/40
                     resize-none transition-all duration-200
                     shadow-[0_0_10px_rgba(34,197,94,0.2)]
                     focus:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-center shrink-0">
        <button 
          onClick={handleSubmit}
          className="px-8 py-3 text-base font-bold text-black 
                   bg-linear-to-r from-green-500 to-green-600 
                   rounded-xl hover:from-green-600 hover:to-green-700 
                   shadow-[0_0_15px_rgba(34,197,94,0.4)] 
                   hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]
                   transition-all duration-300 
                   border border-green-700
                   active:scale-95"
        >
          Submit
        </button>
      </div>
    </div>
  );
};