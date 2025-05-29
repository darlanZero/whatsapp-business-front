import { useRouter } from "next/navigation";

export const usePushQuery = () => {
	const router = useRouter();

	const pushQuery = (key: string, value: string) => {
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set(key, value);
			router.push(newUrl.pathname + newUrl.search); // Use shallow routing for Next.js
	};

	return pushQuery;
};