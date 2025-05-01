import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fontInter } from "@/utils/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify'
import { IDatePickerField } from '@/interfaces/IDatePickerField'


const DatePickerField: React.FC<IDatePickerField> = ({ 
  name, 
  label, 
  ariaLabel, 
  className,
  campaignId,
}) => {
  const queryClient = useQueryClient();

  const currentDate = queryClient.getQueryData<Date>([campaignId, 'dates', name]);

  const updateDateMutation = useMutation({
    mutationFn: async (newDate: Date) => {
      //TODO: Chamada na API para atualizar a data
      //TODO: await api.updateCampaignDate(campaignId, name, newDate);
      return newDate;
    },
    onSuccess: (newDate) => {
      toast.success("Data atualizada com sucesso")
      queryClient.setQueryData([campaignId, 'dates', name], newDate);
    },
    onError: () => {
      toast.error("Error ao atualizar data");
    }
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateDateMutation.mutate(selectedDate);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={name} className={`${fontInter} text-sm font-medium text-gray-800`}>
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              `${fontInter} w-full justify-between text-left text-sm h-[40px] px-3 font-normal border-gray-300 bg-white`,
              !currentDate ? "text-gray-600" : "text-gray-900"
            )}
            aria-label={ariaLabel || label}
            type="button"
            id={name}
            disabled={updateDateMutation.isPending}
          >
            <span className="truncate min-w-[120px] text-left  ">
              {currentDate ? format(currentDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
            </span>
            <CalendarIcon className="ml-2 h-4 w-4 text-indigo-500 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 text-gray-700" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={updateDateMutation.isPending}
            className={`${fontInter} bg-gray-800 text-white`}
          />
        </PopoverContent>
      </Popover>
      {updateDateMutation.isError && (
        <p className="text-red-500 text-xs mt-1">
          Erro ao salvar data
        </p>
      )}
    </div>
  );
};


export { DatePickerField };


