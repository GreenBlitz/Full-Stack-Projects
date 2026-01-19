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
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
      <div className="flex items-center space-x-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          checked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
        }`}
      >
        {checked ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
};

export default ToggleSetting;
