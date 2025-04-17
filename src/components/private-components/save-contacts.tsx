"use client";

import { Users } from "lucide-react";
import { Menu } from "../menu-section";

export const SaveContacts = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={Users} label="Contatos" />
    </Menu.Container>
  );
};
