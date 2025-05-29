import * as React from "react";

const DateTimeForm: React.FC = () => {
  return (
    <div className="flex items-center max-w-[50%] gap-4 w-full">
      <span className="text-nowrap">Agendar Campanha</span>

      <input name="startDate" type="date" className="bg-white flex-1 p-2 rounded shadow" />
      <input name="startDate" type="date" className="bg-white flex-1 p-2 rounded shadow" />
    </div>
  );
};

export { DateTimeForm };
