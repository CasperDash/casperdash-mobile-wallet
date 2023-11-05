import { ReactNode } from 'react';

export interface SettingMenu {
  id: number;
  title: string;
  icon: ReactNode;
  onPress?: () => void;
  subIcon?: any;
  actionComp?: ReactNode;
  show?: boolean;
}
