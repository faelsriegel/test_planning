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
                                version {props.version} Desenvolvido Originalmente por {' '}
                                <a
                                    className="text-purple-500 dark:text-purple-300 opacity-100 hover:opacity-60 transition-all duration-150"
                                    href="https://dilanxd.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                     Dilan N
                                </a>
                            </p>
                        ),
                        message:
                            'Uma maneira fácil e organizada de planejar suas periodos na Universidade. Os dados ficam todos salvos na URL, então salve o link no seu plano para acessar depois ou compartilhe com amigos.',
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
                                title: `O que há de novo?`,
                                description: `Confira quais mudanças foram feitas na última atualização.`,
                                buttonTextOn: `Exibir o log de alterações`,
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
                                description: `Confira o que foi solicitado e no que estou trabalhando na página de problemas do GitHub. Verifique isso antes de enviar feedback, caso alguém já o tenha solicitado.`,
                                buttonTextOn: `Veja o que está por vir`,
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/faelsriegel/test_planning/issues?q=',
                                        '_blank'
                                    );
                                },
                            },
                            {
                                name: 'about_feedback',
                                title: 'Compartilhe sua Opinião!',
                                description: `Encontre algum bug, observe algum erro nos dados do curso ou tenha alguma sugestão? Avise! Estou sempre interessado em tornar o site melhor.`,
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
                            'Todos os dados do seu plano são armazenados na URL. Quando você faz alterações em seu plano, a URL é atualizada para refletir essas alterações. Salve em algum lugar ou compartilhe com um amigo!',
                        confirmButton: 'Copiar para área de transferência',
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
                            toast.success('URL copiado para a área de transferência');
                        },
                    });
                }}
            />
            <MiniButton
                icon={CogIcon}
                color="blue"
                display="Configurações"
                action={() => {
                    props.alert({
                        title: 'Configurações',
                        message: `Personalize sua experiência no SAPU! Essas configurações são salvas em seu navegador e não na URL.`,
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
                                    name: 'Aparência',
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
                                            description: `É um pouco mais feio, mas você pode ver mais na tela de uma só vez, sem precisar rolar a tela.`,
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
                                            description: `Consulte os pré-requisitos e as áreas de distribuição nos itens da aula sem precisar clicar no botão de informações. As informações não serão exibidas se o modo compacto estiver ativado.`,
                                            buttonTextOn: 'Ativar',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'save_location_top',
                                            title: 'Localização do Botão de Salvar',
                                            description: `Ao editar uma projeção vinculada à sua conta, que possui alterações não salvas, o botão Salvar aparece no canto inferior direito da janela por padrão. Você pode movê-lo para o canto superior direito, se preferir.`,
                                            buttonTextOn: 'Cima Direita',
                                            buttonTextOff: 'Baixo Direita',
                                            saveToStorage: true,
                                        },
                                    ],
                                },
                                {
                                    name: 'Avançado',
                                    display: (
                                        <DotsHorizontalIcon className="w-5 h-5" />
                                    ),
                                    options: [
                                        {
                                            name: 'clear_plan',
                                            title: 'Limpar Projeção',
                                            description: `Limpe todos os dados da sua projeção atual, o que inclui tudo para cada ano e tudo em Meus Favoritos. Certifique-se de salvar o URL atual em algum lugar se não quiser perdê-lo.`,
                                            buttonTextOn: 'Limpar',
                                            requireConfirmation: true,
                                            singleAction: () => {
                                                props.f2.clearData();
                                            },
                                        },
                                        {
                                            name: 'save_to_storage',
                                            title: 'Lembrar do projeção mais recente',
                                            description: `Se você visitar este site sem um URL de projeção completo, seu plano modificado mais recentemente será carregado.`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'reduced_motion',
                                            title: 'Reduced Motion',
                                            description: `Com o movimento reduzido ativado, a maioria das animações de transformação e layout no site será desativada.`,
                                            buttonTextOn: 'Ativado',
                                            buttonTextOff: 'Desativado',
                                            saveToStorage: true,
                                        },
                                        {
                                            name: 'debug',
                                            title: 'Modo Debug',
                                            description: `As mensagens de log serão impressas no console do seu navegador (é necessário um nível de log detalhado).`,
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
                    name="Projeções"
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
