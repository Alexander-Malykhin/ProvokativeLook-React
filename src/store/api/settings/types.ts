export interface SettingItem {
    id: number;
    code: string;
    title: string;
    type: string | null;
    image: string | null;
    link: string | null;
    text: string | null;
}

export interface SettingsResponse {
    logo?: SettingItem;
    [key: string]: SettingItem | undefined;
}