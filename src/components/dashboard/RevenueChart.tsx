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
import { IBusinessAccount } from "@/interfaces/IUserMeta";
import { useEffect, useState } from "react";

interface RevenueChartProps {
  selectedBusiness?: IBusinessAccount | null;
}

// Dados mockados - substituir pela API real
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

export const RevenueChart = ({ selectedBusiness }: RevenueChartProps) => {
  const [chartData, setChartData] = useState(lineChartData);
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState("+0%");

  useEffect(() => {
    // Se houver uma empresa selecionada, buscar dados específicos dela
    if (selectedBusiness) {
      console.log('📊 RevenueChart - Carregando dados para empresa:', selectedBusiness.businessName);
      
      // Aqui você faria a chamada para sua API
      // fetchRevenueData(selectedBusiness.businessAccountId);
      
      // Por enquanto, apenas simula um loading
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Dados mockados - em produção, use os dados da API
        const mockRevenue = Math.floor(Math.random() * 100000);
        setRevenue(mockRevenue);
        setRevenueChange(`+${(Math.random() * 20).toFixed(2)}%`);
        setChartData(lineChartData);
      }, 300);
    }
  }, [selectedBusiness]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="col-span-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className={`${fontInter} text-xl font-bold text-gray-700`}>
            Faturamento anual
          </CardTitle>
          {selectedBusiness && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedBusiness.businessName}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="text-xs h-7">
            EM BREVE
          </Button>
          <MoreVertical className="h-5 w-5 text-gray-500 ml-2" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[160px] flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-sm">{revenueChange}</span>
              <div>
                <span className="text-3xl font-bold text-gray-700">
                  {formatCurrency(revenue)}
                </span>
              </div>
            </div>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};