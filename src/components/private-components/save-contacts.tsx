"use client";

import { FaRegUser } from "react-icons/fa6";
import { Menu } from "../menu-section";
import { FiPhone } from "react-icons/fi";

export const SaveContacts = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={FaRegUser} label="Contatos" />
      <Menu.Options>
        <Menu.OptionLink icon={FiPhone} href="/contacts" label="Contatos" />
      </Menu.Options>
    </Menu.Container>
  );
};
