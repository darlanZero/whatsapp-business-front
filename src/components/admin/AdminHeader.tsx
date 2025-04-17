
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AdminHeaderProps {
  peopleCount: number;
  departmentCount: number;
}

export const AdminHeader = ({ peopleCount, departmentCount }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 shadow">
      <Card className="flex-1 border-0 shadow-none">
        <CardContent className="p-4 text-center font-bold text-black">
          <h2 className="text-5xl font-bold">{peopleCount}</h2>
          <p className="text-gray-700 mt-1 font-bold">Pessoas</p>
        </CardContent>
      </Card>
      
      <div className="hidden md:block">
        <Separator orientation="vertical" />
      </div>
      
      <Card className="flex-1 border-0 shadow-none">
        <CardContent className="p-4 text-center">
          <h2 className="text-5xl font-bold text-black">{departmentCount}</h2>
          <p className="text-gray-700 mt-1 font-bold">Departamentos</p>
        </CardContent>
      </Card>
    </div>
  );
};
