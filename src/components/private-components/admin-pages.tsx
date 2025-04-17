"use client";

import { FaUsers } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Menu } from "../menu-section";

export const AdminPages = () => {
  return (
    <Menu.Container>
      <Menu.Trigger
        icon={MdOutlineAdminPanelSettings}
        label="Área administrativa"
      />
      <Menu.Options>
        <Menu.OptionLink
          href="/users"
          icon={FaUsers}
          label="Gerenciar usuários"
        />
      </Menu.Options>
    </Menu.Container>
  );
};
