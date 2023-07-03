interface optionsInterface {
    deploy: string;
    list?: boolean;
}
declare const deploy: (key: string, list?: boolean) => void;
export declare const certification: (option: optionsInterface) => void;
export default deploy;
