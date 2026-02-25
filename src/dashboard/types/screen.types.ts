export interface IScreen {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  color: string;
  creator: string;
  changeTimestamp: Date;
  isShared?: boolean;
}

export interface IScreenCreator {
  creatorId: string;
  creatorName: string;
}

export interface ISharedScreen {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  color: string;
  creator: string;
  creatorName: string;
  isShared: boolean;
}

export type TToggleShare = {
  screenId: IScreen["id"];
  prevShareStatus: boolean;
};

export enum ScreenAction {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE',
  Share = 'SHARE',
  Unshare = 'UNSHARE'
}

export type ScreenActionBody = {
  id: IScreen['id'],
  action: ScreenAction
}
