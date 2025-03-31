export interface MenuItem{
    icon: string,
    label: string,
    route?: string,
    children?: MenuItem[]; 
    expanded?: boolean; 
}