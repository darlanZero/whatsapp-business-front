export type IApiSelection = 'evolution' | 'meta';

export interface IApiSelectionConfig {
    type: IApiSelection;
    name: string;
    description: string;
    icon?: string;
}