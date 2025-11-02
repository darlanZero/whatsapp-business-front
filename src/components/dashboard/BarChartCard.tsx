import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { MoreVertical } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IBusinessAccount } from "@/interfaces/IUserMeta";
import { useEffect, useState } from "react";

interface BarChartCardProps {
  selectedBusiness?: IBusinessAccount | null;
}

// Dados mockados - substituir pela API real
const barChartData = [
  { month: "Jan", atual: 20, anterior: -15 },
  { month: "Fev", atual: 25, anterior: -10 },
  { month: "Mar", atual: 15, anterior: -20 },
  { month: "Abr", atual: 30, anterior: -15 },
  { month: "Mai", atual: 10, anterior: -30 },
  { month: "Jun", atual: 25, anterior: -15 },
  { month: "Jul", atual: 20, anterior: -10 },
  { month: "Ago", atual: 30, anterior: -20 },
  { month: "Set", atual: 15, anterior: -25 },
  { month: "Out", atual: 20, anterior: -15 },
  { month: "Nov", atual: 25, anterior: -20 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded-md text-xs">
        <p className="mb-1">{`${label}/2023`}</p>
        <p className="font-bold">R$ 31.549,62</p>
      </div>
    );
  }

  return null;
};

export const BarChartCard = ({ selectedBusiness }: BarChartCardProps) => {
  const [chartData, setChartData] = useState(barChartData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se houver uma empresa selecionada, buscar dados específicos dela
    if (selectedBusiness) {
      console.log('📊 BarChartCard - Carregando dados para empresa:', selectedBusiness.businessName);
      
      // Aqui você faria a chamada para sua API
      // fetchChartData(selectedBusiness.businessAccountId);
      
      // Por enquanto, apenas simula um loading
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Dados mockados - em produção, use os dados da API
        setChartData(barChartData);
      }, 300);
    }
  }, [selectedBusiness]);

  return (
    <Card className="col-span-8 flex-1 border-zinc-200 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold text-gray-900">
            Total Recebido
          </CardTitle>
          {selectedBusiness && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedBusiness.businessName} • {selectedBusiness.displayPhoneNumber}
            </p>
          )}
        </div>
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-800">Últimos 12 meses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-sm text-gray-800">Período Anterior</span>
          </div>
        </div>
        
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
                barGap={0}
              >
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.abs(value)}`}
                  domain={[-40, 40]}
                  ticks={[-40, -30, -20, -10, 0, 10, 20, 30, 40]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="right"
                  dataKey="atual"
                  fill="#4F74DF"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  yAxisId="right"
                  dataKey="anterior"
                  fill="#FB9638"
                  radius={[0, 0, 4, 4]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};