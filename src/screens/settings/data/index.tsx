export interface SettingMenu {
  id: number;
  title: string;
  icon: any;
  onPress?: () => void;
  subIcon?: any;
  actionComp?: any;
}
