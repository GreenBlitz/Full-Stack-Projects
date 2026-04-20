// בס"ד

import { Children, type FC } from "react";
import { superFormInputStyles } from "./TeamCard";

interface MetricCardProps {
  label: string;
  onChange: (text: string) => void;
  text: string;
  children?: React.JSX.Element;
}

export const MetricCard: FC<MetricCardProps> = ({
  label,
  onChange,
  text,
  children,
}) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-black uppercase tracking-wider text-emerald-400">
        {label}
      </span>
      {children}
    </div>
    <textarea
      value={text ?? ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={`Comments about ${label.toLowerCase()}...`}
      rows={2}
      className={`${superFormInputStyles} placeholder:text-slate-600 resize-none`}
    />
  </div>
);
