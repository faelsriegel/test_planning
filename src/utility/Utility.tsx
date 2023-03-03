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
        let keys = Object.keys(localStorage);
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
                return 'PRIMEIRO ANO';
            case 1:
                return 'SEGUNDO ANO';
            case 2:
                return 'TERCEIRO ANO';
            case 3:
                return 'QUARTO ANO';
            case 4:
                return 'QUINTO ANO';
            case 5:
                return 'SEXTO ANO';
            case 6:
                return 'SETIMO ANO';
            case 7:
                return 'OITAVO ANO';
            case 8:
                return 'NONO ANO';
            case 9:
                return 'DECIMO ANO';
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
                return 'red';
            case 1:
                return 'blue';
            case 2:
                return 'green';
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
            confirmButton: 'View status',
            confirmButtonColor: 'red',
            cancelButton: 'Close',
            iconBackgroundColor: 'red',
            icon: (
                <ExclamationIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                />
            ),
            textView: error + ' - ' + from,
            action: () => {
                window.open('https://status.dilanxd.com', '_blank');
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
