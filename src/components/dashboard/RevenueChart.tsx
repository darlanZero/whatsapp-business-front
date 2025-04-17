import { 
    LineChart,
    Line,
    ResponsiveContainer,
  } from "recharts";
  import { MoreVertical } from "lucide-react";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";
  
  // Dados para o gráfico de linha
  const lineChartData = [
    { month: "Jan", valor: 0 },
    { month: "Fev", valor: 0 },
    { month: "Mar", valor: 0 },
    { month: "Abr", valor: 5000 },
    { month: "Mai", valor: 10000 },
    { month: "Jun", valor: 15000 },
    { month: "Jul", valor: 20000 },
    { month: "Ago", valor: 25000 },
    { month: "Set", valor: 30000 },
    { month: "Out", valor: 40000 },
    { month: "Nov", valor: 50000 },
    { month: "Dez", valor: 60000 },
  ];
  
  export const RevenueChart = () => {
    return (
      <Card className="col-span-4 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className={`${fontInter} text-xl font-bold text-gray-700`}>Faturamento anual</CardTitle>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="text-xs h-7">
              EM BREVE
            </Button>
            <MoreVertical className="h-5 w-5 text-gray-500 ml-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-sm">+0%</span>
            <div>
              <span className="text-3xl font-bold text-gray-700">R$0</span>
            </div>
          </div>
          <div className="h-[120px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#FB9638"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };
  