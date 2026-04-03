// בס"ד
import type { FC, ChangeEvent } from "react";

interface ToggleSettingProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSetting: FC<ToggleSettingProps> = ({
  id,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950/50 rounded-xl hover:border-emerald-500/50 transition-all duration-200 shadow-inner">
      <div className="flex items-center space-x-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
        <div>
          <h3 className="font-semibold text-emerald-100">{title}</h3>
          <p className="text-sm text-emerald-500/60">{description}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${
          checked ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-zinc-800 text-zinc-400 border-zinc-700"
        }`}
      >
        {checked ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
};

export default ToggleSetting;
