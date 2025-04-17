export function formatNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const cleaned = phoneNumber?.replace(/\D/g, "");

  // Check if it starts with the country code 55
  if (cleaned?.startsWith("55") && cleaned?.length === 13) {
    const countryCode = cleaned.slice(0, 2);
    const areaCode = cleaned.slice(2, 4);
    const firstPart = cleaned.slice(4, 9);
    const secondPart = cleaned.slice(9);

    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  return phoneNumber;
}
