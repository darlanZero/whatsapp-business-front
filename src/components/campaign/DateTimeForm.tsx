import { DatePickerField } from '../campaign/DatePickerField';
import { TimePickerField } from '../campaign/TimePickerField';
import * as React from "react";

const DateTimeForm: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex flex-col gap-4 min-w-[200px]">
        <DatePickerField
          name="startDate"
          label="Data de Início"
          ariaLabel="Data de Início"
          className="w-full"
        />
        <DatePickerField
          name="endDate"
          label="Data de Fim"
          ariaLabel="Data de Fim"
          className="w-full"
        />
      </div>
      
      <div className="min-w-[150px]">
        <TimePickerField
          name="endTime"
          label="Horário de Encerramento"
          ariaLabel="Horário de Encerramento"
          className="w-full"
        />
      </div>
    </div>
  );
};

export  { DateTimeForm };