/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";

interface BusinessAccount {
    businessAccountId: string;
    businessName: string;
    phoneNumberId: string;
    displayPhoneNumber: string;
    wabaId: string;
    wabaName: string;
}

interface DashboardData {
    messagesSent: number;
    completedCampaigns: number;
    contacts: number;
    googleContacts: number;
    revenue: number;
    revenueChange: string;
    barChartData: any[];
    lineChartData: any[];
}

export const useDashboardData = (selectedBusiness: BusinessAccount | undefined) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        if (!selectedBusiness) {
        return;
        }

        setLoading(true);
        setError(null);

        try {
        // Aqui você fará a chamada real para sua API
        // Por exemplo:
        // const response = await fetch(`/api/dashboard/${selectedBusiness.businessAccountId}`);
        // const data = await response.json();

        // Simulação de dados (remova em produção)
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData: DashboardData = {
            messagesSent: Math.floor(Math.random() * 500) + 100,
            completedCampaigns: Math.floor(Math.random() * 100) + 20,
            contacts: Math.floor(Math.random() * 300) + 50,
            googleContacts: Math.floor(Math.random() * 150) + 20,
            revenue: Math.floor(Math.random() * 100000) + 10000,
            revenueChange: `+${(Math.random() * 20).toFixed(2)}%`,
            barChartData: [
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
            ],
            lineChartData: [
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
            ],
        };

        setData(mockData);
        } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Falha ao carregar dados do dashboard");
        } finally {
        setLoading(false);
        }
    }, [selectedBusiness]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        loading,
        data,
        error,
        refetch: fetchDashboardData,
    };
};