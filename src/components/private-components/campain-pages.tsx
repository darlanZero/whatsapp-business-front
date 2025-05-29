import { BsCollection } from "react-icons/bs";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { Menu } from "../menu-section";
import { PiMegaphoneSimple } from "react-icons/pi";

export const CampainPage = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={TbBrandCampaignmonitor} label="Configurar Camp." />
      <Menu.Options>
        <Menu.OptionLink href="/lists" icon={BsCollection} label="Listas" />
      </Menu.Options>

      <Menu.Options>
        <Menu.OptionLink
          href="/campaign"
          icon={PiMegaphoneSimple}
          label="Campanhas"
        />
      </Menu.Options>
    </Menu.Container>
  );
};
