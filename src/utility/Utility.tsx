import { ExclamationIcon } from '@heroicons/react/outline';
import { AlertData } from '../types/AlertTypes';
import {
    Color,
    ReadUserOptions,
    UserOptions,
    UserOptionValue,
} from '../types/BaseTypes';
import { PlanErrorLocation } from '../types/ErrorTypes';

let Utility = {
    BACKGROUND_LIGHT: '#FFFFFF',
    BACKGROUND_DARK: '#262626',

    loadSwitchesFromStorage: (
        setSwitchFunction: (
            key: string,
            val: UserOptionValue,
            save: boolean | undefined
        ) => void
    ): UserOptions => {
        let switches: ReadUserOptions = {
            save_to_storage: true,
            notifications: true,
            settings_tab: 'Appearance',
        };
        // let keys = Object.keys(localStorage);
        let keys = [];
            if (typeof window !== 'undefined') {
                keys = Object.keys(localStorage);
        }
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('switch_')) {
                let store = localStorage.getItem(keys[i]);
                let val: UserOptionValue = undefined;
                if (store != null) {
                    if (store === 'true') val = true;
                    else if (store === 'false') val = false;
                    else val = store;
                }
                let switchId = keys[i].substring(7);
                switches[switchId] = val;
            }
        }
        return {
            set: setSwitchFunction,
            get: switches,
        };
    },

    saveSwitchToStorage: (key: string, val?: string) => {
        if (val) {
            localStorage.setItem('switch_' + key, val);
        } else {
            localStorage.removeItem('switch_' + key);
        }
    },

    getDistroAcronym: (distroString: string) => {
        let distro = distroString.split(' ');
        let acronym = '';
        distro.forEach((d) => (acronym += d[0]));
        return acronym;
    },

    convertDistros: (distros: string | undefined) => {
        let strings: string[] = [];

        if (!distros) return strings;

        for (let i = 0; i < distros.length; i++) {
            let d = parseInt(distros[i]);

            switch (d) {
                case 1:
                    strings.push('Engenharia');
                    break;
                case 2:
                    strings.push('Engenharia');
                    break;
                case 3:
                    strings.push('Engenharia');
                    break;
                case 4:
                    strings.push('Engenharia');
                    break;
                case 5:
                    strings.push('Engenharia');
                    break;
                case 6:
                    strings.push('Engenharia');
                    break;
                case 7:
                    strings.push('Engenharia');
                    break;
                default:
                    strings.push('Indefinido');
                    break;
            }
        }

        return strings;
    },

    convertYear: (num: number) => {
        switch (num) {
            case 0:
                return '2023';
            case 1:
                return '2024';
            case 2:
                return '2025';
            case 3:
                return '2026';
            case 4:
                return '2027';
            case 5:
                return '2028';
            case 6:
                return '2029';
            case 7:
                return '2030';
            case 8:
                return '2031';
            case 9:
                return '2032';
            default:
                return 'AAH MUITOS ANOS NÃOOO';
        }
    },

    convertQuarter: (num: number): { title: string; color: Color } => {
        switch (num) {
            case 0:
                return { title: '1º PERIODO', color: 'lime' };
            case 1:
                return { title: '2º PERIODO', color: 'sky' };
            case 2:
                return { title: '3º PERIODO', color: 'orange' };
            case 3:
                return { title: '4º PERIODO', color: 'yellow' };
            default:
                return { title: 'LOL WHAT??', color: 'gray' };
        }
    },

    prereqColor: (num: number) => {
        switch (num) {
            case 0:
                return 'green';
            case 1:
                return 'blue';
            case 2:
                return 'orange';
            case 3:
                return 'yellow';
            case 4:
                return 'purple';
            default:
                return 'gray';
        }
    },

    errorAlert: (from: PlanErrorLocation, error: string): AlertData => {
        return {
            title: "Bem, isso não é bom...",
            message: `Isso não era para acontecer. Um erro inesperado ocorreu.
            Confira o status do site para ver se o que você está enfrentando é um problema conhecido.
            Se não for, por favor me avise. Certifique-se de observar a mensagem de erro abaixo.`,
            confirmButton: 'Veja o Status',
            confirmButtonColor: 'red',
            cancelButton: 'Fechar',
            iconBackgroundColor: 'red',
            icon: (
                <ExclamationIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                />
            ),
            textView: error + ' - ' + from,
            action: () => {
                window.open('https://status.faelsriegel.com', '_blank');
            },
        };
    },

    generateRandomString: (length: number) => {
        let text = '';
        let possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        return text;
    },
};

export default Utility;
