import { IWhatsappToCreate } from "@/app/(private)/(all)/lists/atom";

export const areAllItemsIncluded = (
  smallerArray: { remoteJid: string }[],
  largerArray: IWhatsappToCreate[]
): boolean => {
  return smallerArray.every((smallItem) =>
    largerArray.some(
      (largeItem) => largeItem.phoneNumber === smallItem.remoteJid.split("@")[0]
    )
  );
};

export const addOrRemoveContact = (
  data: IWhatsappToCreate,
  setSelectedContacts: React.Dispatch<React.SetStateAction<IWhatsappToCreate[]>>
) => {
  setSelectedContacts((prev) => {
    const currentContacts = prev || [];

    const existingIndex = currentContacts.findIndex(
      (c) => c.phoneNumber === data.phoneNumber
    );

    if (existingIndex >= 0) {
      return [
        ...currentContacts.slice(0, existingIndex),
        ...currentContacts.slice(existingIndex + 1),
      ];
    }

    return [
      ...currentContacts,
      {
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
    ];
  });
};
