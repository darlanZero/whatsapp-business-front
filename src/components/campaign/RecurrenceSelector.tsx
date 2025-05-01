import { fontInter } from "@/utils/fonts";

interface RecurrenceSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const options = [
  { value: "uma-vez", label: "Uma vez" },
  { value: "manual", label: "Manual" },
  { value: "recorrente", label: "Recorrente" },
];


const RecurrenceSelector = ({ value, onChange }: RecurrenceSelectorProps) => {
  return (
    <div className="flex flex-col self-start w-auto">
      <label className={`${fontInter} mb-1 text-gray-900`}>Recorrência</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fontInter} w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        aria-label="Recorrência"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export  {RecurrenceSelector};
