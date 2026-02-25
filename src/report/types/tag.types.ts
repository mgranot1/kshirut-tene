export interface Tag {
  id: string;
  text: string;
}

export interface EquipmentTag extends Tag {
  inEquipment: boolean;
}

export interface ChangeTagsAPIInput {
  equipment: string;
  ids: string[];
  deletionFlag: boolean;
}
