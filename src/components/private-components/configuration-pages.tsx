"use client";

import { Settings } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Menu } from "../menu-section";

export const ConfigurationPage = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={Settings} label="Configurações" />
      <Menu.Options>
        <Menu.OptionLink href="/whatsapp" icon={FaWhatsapp} label="Meus WhatsApp" />
      </Menu.Options>
    </Menu.Container>
  );
};
