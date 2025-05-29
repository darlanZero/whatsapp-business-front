"use client"; // Mantém o use client se for um componente de cliente Next.js

import { useState } from "react";
// Mantendo as importações originais, assumindo que os caminhos estão corretos
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fontInter } from "@/utils/fonts"; // Mantendo a importação da fonte

export const FilterBar = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [selectedProducts, setSelectedProducts] = useState("todos");

  return (
    <div className="flex flex-col md:flex-row mb-6 gap-2 text-zinc-700 md:items-center">
      <div className="w-full md:w-auto">
        <Select value={selectedProducts} onValueChange={setSelectedProducts}>
          <SelectTrigger className={`${fontInter} border-zinc-200 gap-5 text-gray-700 w-full`}>
            <SelectValue placeholder="Todos os Produtos" />
          </SelectTrigger>
          <SelectContent className={`${fontInter} text-zinc-500 z-30 border-zinc-200 bg-white`}>
            <SelectItem value="todos" className={`${fontInter}`}>Todos os Produtos</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="vendas">Vendas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-auto">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className={`${fontInter} border-zinc-200 gap-5 text-gray-700 w-full`}>
            <SelectValue placeholder="Últimos 12 meses" />
          </SelectTrigger>
          <SelectContent className="text-zinc-500 z-30 border-zinc-200 bg-white">
            <SelectItem value="12">Últimos 12 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className={`${fontInter} bg-blue-600 hover:bg-blue-700 text-blue-100 w-full md:w-auto`}>
        Filtrar
      </Button>
    </div>
  );
};
