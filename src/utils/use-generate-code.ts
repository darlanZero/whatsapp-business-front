import { queryClient } from "@/providers/query-provider";
import { apiAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

interface useGenerateQrCoreProps {
	name?: string | null;
	number?: string | null;
}

type GetQrCode = {
	base64: string;
};

export const useGenerateQrCore = (props: useGenerateQrCoreProps) => {
	const { data } = useQuery({
			queryKey: ["whatsapp", "qrcode"],
			enabled: !!props.name && !!props.number,
			queryFn: async () => {
					const url = `/whatsapp/instance/connect/${props.name}?phoneNumber=${props.number}`;
					return (await apiAuth.get<GetQrCode>(url))?.data;
			}
	});

	const invalidateQueries = useCallback(async () => {
			await queryClient.invalidateQueries({
					queryKey: ["whatsapp"],
			});
	}, []);

	useEffect(() => {
			return () => {
					invalidateQueries();
			};
	}, [invalidateQueries]);

	return {
			data,
	};
};