import { BsCollection } from "react-icons/bs";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { Menu } from "../menu-section";

export const CampainPage = () => {
  return (
    <Menu.Container>
      <Menu.Trigger icon={TbBrandCampaignmonitor} label="Configurar Camp." />
      <Menu.Options>
        <Menu.OptionLink
          href="/lists"
          icon={BsCollection}
          label="Listas"
        />
      </Menu.Options>
    </Menu.Container>
  );
};
