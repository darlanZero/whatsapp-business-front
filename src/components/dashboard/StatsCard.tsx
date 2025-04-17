
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fontInter, fontOpenSans } from "@/utils/fonts";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeColor?: "green" | "red";
  iconBgClass?: string;
  iconColorClass?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeColor = "green",
  iconBgClass = "bg-green-50",
  iconColorClass = "text-green-500"
}: StatsCardProps) => {
  return (
    <Card className="border-zinc-200">
      <CardHeader className="flex flex-row items-center pb-2">
        <CardTitle className={`${fontOpenSans} text-sm font-medium text-gray-700`}>
          {title}
        </CardTitle>
        <div className={`ml-auto ${iconBgClass} p-1 rounded `}>
          <div className={`h-5 w-5 ${iconColorClass}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className={`${fontInter} text-4xl font-bold text-gray-700`}>{value}</span>
          {change && (
            <span className={`${changeColor === "green" ? "text-green-500" : "text-red-500"} text-sm mb-1`}>
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
