export interface NavigationProfileItemInterface {
  id: number;
  title: string;
  url: string;
}

export interface NavigationProfileItemProps {
  item: NavigationProfileItemInterface;
  onClose: () => void;
}
