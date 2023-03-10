import React from 'react';
import Utility from '../../utility/Utility';
import {
    ExternalLinkIcon,
    InformationCircleIcon,
    CogIcon,
    SearchIcon,
    BookmarkIcon,
    CollectionIcon,
    PencilIcon,
    DotsHorizontalIcon,
} from '@heroicons/react/outline';
import { Color, ColorMap, UserOptions } from '../../types/BaseTypes';
import { Alert } from '../../types/AlertTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import Account from '../../Account';
import debugModule from 'debug';
import toast from 'react-hot-toast';
import { TabBar, TabBarButton } from './TabBar';

interface MiniButtonProps {
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
    color: Color;
    display: string;
    action: () => void;
}

function MiniButton(props: MiniButtonProps) {
    let color = props.color;
    return (
        <button
            className={`p-1 border-2 border-gray-400 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300
                hover:border-${color}-500 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-gray-800
                hover:text-${color}-500 dark:hover:text-${color}-400 transition-all duration-150 relative group`}
            onClick={() => {
                props.action();
            }}
        >
            <props.icon className="w-5 h-5" />
            <div
                className={`hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 p-1 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
            >
                {props.display}
            </div>
        </button>
    );
}

const TabBarButtonColors: ColorMap = {
    Search: 'gray',
    'My List': 'indigo',
    Plans: 'rose',
};

interface TaskBarProps {
    alert: Alert;
    version: string;
    switches: UserOptions;
    f2: PlanSpecialFunctions;
    tabLoading: boolean;
}

function TaskBar(props: TaskBarProps) {
    return (
        <div className="flex mx-auto mt-2 mb-4 gap-2">
            <MiniButton
                icon={InformationCircleIcon}
                color="purple"
                display="Sobre"
                action={() => {
                    props.alert({
                        title: 'Teste Planning SAPU',
                        customSubtitle: (
                            <p className="text-md font-light text-gray-500 dark:text-gray-400">
                                version {props.version}
                            </p>
                        ),
                        message:
                            'Uma maneira f??cil e organizada de planejar suas periodos na Universidade. Os dados ficam todos salvos na URL, ent??o salve o link no seu plano para acessar depois ou compartilhe com amigos.',
                        confirmButton: 'Ver no GitHub',
                        confirmButtonColor: 'purple',
                        cancelButton: 'Fechar',
                        iconBackgroundColor: 'purple',
                        icon: (
                            <InformationCircleIcon
                                className="h-6 w-6 text-purple-600"
                                aria-hidden="true"
                            />
                        ),
                        action: () => {
                            window.open(
                                'https://github.com/faelsriegel/test_planning/',
                                '_blank'
                            );
                        },
                        options: [
                            {
                                name: 'about_change_log',
                                title: `O que h?? de novo?`,
                                description: `Confira quais mudan??as foram feitas na ??ltima atualiza????o.`,
                                buttonTextOn: `Exibir o log de altera????es`,
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/faelsriegel/test_planning/blob/main/CHANGELOG.md',
                                        '_blank'
                                    );
                                },
                            },
                            {
                                name: 'about_coming_soon',
                                title: 'Em breve',
                                description: `Confira o que foi solicitado e no que estou trabalhando na p??gina de problemas do GitHub. Verifique isso antes de enviar feedback, caso algu??m j?? o tenha solicitado.`,
                                buttonTextOn: `Veja o que est?? por vir`,
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/faelsriegel/test_planning/issues?q=',
                                        '_blank'
                                    );
                                },
                            },
                            {
                                name: 'about_feedback',
                                title: 'Compartilhe sua Opini??o!',
                                description: `Encontre algum bug, observe algum erro nos dados do curso ou tenha alguma sugest??o? Avise! Estou sempre interessado em tornar o site melhor.`,
                                buttonTextOn: 'Deixar feedback',
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/faelsriegel/test_planning/blob/main/FEEDBACK.md',
                                        '_blank'
                                    );
                                },
                            },
                        ],
                    });
                }}
            />
            <MiniButton
                icon={ExternalLinkIcon}
                color="green"
                display="Compartilhar"
                action={() => {
                    props.alert({
                        title: 'Pronto para Compartilhar!',
                        message:
                            'Todos os dados do seu plano s??o armazenados na URL. Quando voc?? faz altera????es em seu plano, a URL ?? atualizada para refletir essas altera????es. Salve em algum lugar ou compartilhe com um amigo!',
                        confirmButton: 'Copiar para ??rea de transfer??ncia',
                        confirmButtonColor: 'emerald',
                        cancelButton: 'Fechar',
                        iconBackgroundColor: 'emerald',
                        icon: (
                            <ExternalLinkIcon
                                className="h-6 w-6 text-emerald-600"
                                aria-hidden="true"
                            />
                        ),
                        textView: window.location.href,
                        action: () => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('URL copiado para a ??rea de transfer??ncia');
                        },
                    });
                }}
            />
            <MiniButton
                icon={CogIcon}
                color="blue"
                display="Configura????es"
                action={() => {
                    props.alert({
                        title: 'Configura????es',
                        message: `Personalize sua experi??ncia no SAPU! Essas configura????es s??o salvas em seu navegador e n??o na URL.`,
                        confirmButton: 'Fechar',
                        confirmButtonColor: 'blue',
                        iconBackgroundColor: 'blue',
                        icon: (
                            <CogIcon
                                className="h-6 w-6 text-gray-600"
                                aria-hidden="true"
                            />
                        ),
                        tabs: {
                            switchName: 'settings_tab',
                            colorMap: {
                                Appearance: 'gray',
                                Advanced: 'gray',
                            },
                            tabs: [
                                {
                                    name: 'Apar??ncia',
                                    display: <PencilIcon className="w-5 h-5" />,
                                    options: [
                                        {
                                            name: 'dark',
                                            title: 'Modo Escuro',
                                            description: `Torne-se o Cavaleiro das Trevas.`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                            bonusAction: (newSwitch) => {
                                                let color = newSwitch
                                                    ? Utility.BACKGROUND_DARK
                                                    : Utility.BACKGROUND_LIGHT;
                                                document.body.style.backgroundColor =
                                                    color;
                                                document
                                                    .querySelector(
                                                        'meta[name="theme-color"]'
                                                    )
                                                    ?.setAttribute(
                                                        'content',
                                                        color
                                                    );
                                            },
                                        },
                                        {
                                            name: 'compact',
                                            title: 'Modo Compacto',
                                            description: `?? um pouco mais feio, mas voc?? pode ver mais na tela de uma s?? vez, sem precisar rolar a tela.`,
                                            buttonTextOn: 'Ativar',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'quarter_units',
                                            title: 'Mostrar os Creditos por Periodo',
                                            description:
                                                'Revele a contagem de creditos por periodo.',
                                            buttonTextOn: 'Ativar',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'more_info',
                                            title: 'Mostrar + Dados Sobre as Disciplinas',
                                            description: `Consulte os pr??-requisitos e as ??reas de distribui????o nos itens da aula sem precisar clicar no bot??o de informa????es. As informa????es n??o ser??o exibidas se o modo compacto estiver ativado.`,
                                            buttonTextOn: 'Ativar',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'save_location_top',
                                            title: 'Localiza????o do Bot??o de Salvar',
                                            description: `Ao editar uma proje????o vinculada ?? sua conta, que possui altera????es n??o salvas, o bot??o Salvar aparece no canto inferior direito da janela por padr??o. Voc?? pode mov??-lo para o canto superior direito, se preferir.`,
                                            buttonTextOn: 'Cima Direita',
                                            buttonTextOff: 'Baixo Direita',
                                            saveToStorage: true,
                                        },
                                    ],
                                },
                                {
                                    name: 'Avan??ado',
                                    display: (
                                        <DotsHorizontalIcon className="w-5 h-5" />
                                    ),
                                    options: [
                                        {
                                            name: 'clear_plan',
                                            title: 'Limpar Proje????o',
                                            description: `Limpe todos os dados da sua proje????o atual, o que inclui tudo para cada ano e tudo em Meus Favoritos. Certifique-se de salvar o URL atual em algum lugar se n??o quiser perd??-lo.`,
                                            buttonTextOn: 'Limpar',
                                            requireConfirmation: true,
                                            singleAction: () => {
                                                props.f2.clearData();
                                            },
                                        },
                                        {
                                            name: 'save_to_storage',
                                            title: 'Lembrar do proje????o mais recente',
                                            description: `Se voc?? visitar este site sem um URL de proje????o completo, seu plano modificado mais recentemente ser?? carregado.`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'reduced_motion',
                                            title: 'Reduced Motion',
                                            description: `Com o movimento reduzido ativado, a maioria das anima????es de transforma????o e layout no site ser?? desativada.`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'debug',
                                            title: 'Modo Debug',
                                            description: `As mensagens de log ser??o impressas no console do seu navegador (?? necess??rio um n??vel de log detalhado).`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                            bonusAction: (newSwitch) => {
                                                if (newSwitch) {
                                                    debugModule.enable('*');
                                                } else {
                                                    debugModule.disable();
                                                }
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    });
                }}
            />
            <TabBar
                switches={props.switches}
                switchName="tab"
                tabLoading={props.tabLoading}
                colorMap={TabBarButtonColors}
            >
                <TabBarButton
                    name="Procurar"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['Search']}
                >
                    <SearchIcon className="w-5 h-5" />
                </TabBarButton>
                 <TabBarButton
                    name="Meus Favoritos"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['My List']}
                >
                    <BookmarkIcon className="w-5 h-5" />
                </TabBarButton>
                <TabBarButton
                    name="Proje????es"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['Plans']}
                >
                    <CollectionIcon className="w-5 h-5" />
                    <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
                        {Account.getPlanName(
                            props.switches.get.active_plan_id as string
                        )}
                    </p>
                </TabBarButton> 
            </TabBar>
        </div>
    );
}

export default TaskBar;
