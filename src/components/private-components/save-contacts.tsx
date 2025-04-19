"use client";

import { FaRegUser } from "react-icons/fa6";
import { Menu } from "../menu-section";

export const SaveContacts = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={FaRegUser} label="Contatos" />
    </Menu.Container>
  );
};
