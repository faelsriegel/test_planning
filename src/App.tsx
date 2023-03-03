import React from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Content from './components/Content';
import CourseManager from './CourseManager';
import Utility from './utility/Utility';
import Info from './components/menu/Info';
import TaskBar from './components/menu/TaskBar';
import Search from './components/search/Search';
import Alert from './components/menu/Alert';
import Bookmarks from './components/bookmarks/Bookmarks';
import AccountPlans from './components/account/AccountPlans';
import {
    ExclamationIcon,
    PlusIcon,
    SaveIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import {
    Course,
    CourseLocation,
    PlanData,
    PlanModificationFunctions,
    PlanSpecialFunctions,
} from './types/PlanTypes';
import { AlertData } from './types/AlertTypes';
import { UserOptions, UserOptionValue } from './types/BaseTypes';
import Account from './Account';
import PlanError from './utility/PlanError';
import debug from 'debug';
import toast, { Toaster } from 'react-hot-toast';
var d = debug('main');

const VERSION = process.env.REACT_APP_VERSION ?? 'UNKNOWN';

interface AppState {
    data: PlanData;
    switches: UserOptions;
    alertData?: AlertData;
    f: PlanModificationFunctions;
    f2: PlanSpecialFunctions;
    loadingLogin: boolean;
    unsavedChanges: boolean;
    originalDataString: string;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        let defaultSwitches = Utility.loadSwitchesFromStorage(
            (key, value, save) => {
                this.setSwitch(key, value, save);
            }
        );
        defaultSwitches.get.tab = 'Search';

        let app = this;

        let data: PlanData = {
            courses: [
                [[], []],
                [[], []],
                [[], []],
                [[], []],
            ],
            bookmarks: {
                noCredit: new Set<Course>(),
                forCredit: new Set<Course>(),
            },
        };

        let f: PlanModificationFunctions = {
            addCourse: (course, location) => {
                app.addCourse(course, location);
            },
            removeCourse: (courseIndex, location) => {
                app.removeCourse(courseIndex, location);
            },
            moveCourse: (course, oldLocation, newLocation) => {
                app.moveCourse(course, oldLocation, newLocation);
            },
            addBookmark: (course, forCredit) => {
                app.addBookmark(course, forCredit);
            },
            removeBookmark: (course, forCredit) => {
                app.removeBookmark(course, forCredit);
            },
        };

        let f2: PlanSpecialFunctions = {
            addSummerQuarter: (year) => {
                app.addSummerQuarter(year);
            },
            addYear: () => {
                app.addYear();
            },
            clearData: (year?: number) => {
                app.clearData(year);
            },
        };

        if (defaultSwitches.get.dark) {
            document.body.style.backgroundColor = Utility.BACKGROUND_DARK;
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', Utility.BACKGROUND_DARK);
        } else {
            document.body.style.backgroundColor = Utility.BACKGROUND_LIGHT;
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', Utility.BACKGROUND_LIGHT);
        }

        this.state = {
            data: data,
            switches: defaultSwitches,
            f,
            f2,
            loadingLogin: false,
            unsavedChanges: false,
            originalDataString: '',
        };
    }

    componentDidMount() {
        this.setState({ loadingLogin: true });
        let params = new URLSearchParams(window.location.search);

        let code = params.get('code');
        params.delete('code');
        let state = params.get('state');
        params.delete('state');
        let action = params.get('action');
        params.delete('action');

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${params.toString()}`
        );

        if (action) {
            switch (action) {
                case 'login':
                    toast.success('Logged in');
                    break;
                case 'logout':
                    toast.success('Logged out', {
                        iconTheme: {
                            primary: 'red',
                            secondary: 'white',
                        },
                    });
                    break;
            }
        }

        if (code && state) {
            d('query has code and state, logging in');
            Account.logIn(code, state).then((response) => {
                if (!response.success) {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_initial_login_code',
                            response.data as string
                        )
                    );
                } else {
                    this.setSwitch('tab', 'Plans');
                    this.setSwitch('active_plan_id', 'None', true);
                }
                this.initializePlan(params, () => {
                    this.setState({ loadingLogin: false });
                });
            });
        } else {
            this.initializePlan(params, () => {
                this.setState({ loadingLogin: false });
            });
        }
    }

    initializePlan(params: URLSearchParams, callback: () => void) {
        d('plan initializing');
        CourseManager.load(params, this.state.switches)
            .then(({ data, activePlanId, originalDataString, method }) => {
                this.setState({ loadingLogin: false });
                if (data === 'malformed') {
                    this.showAlert({
                        title: 'Não foi possível carregar o plano',
                        message: `O plano que você está tentando acessar não é válido. Se você estiver carregando por meio de um URL, verifique se ele não foi modificado manualmente.`,
                        confirmButton: 'Que pena.',
                        confirmButtonColor: 'red',
                        iconBackgroundColor: 'red',
                        icon: (
                            <ExclamationIcon
                                className="h-6 w-6 text-red-600"
                                aria-hidden="true"
                            />
                        ),
                    });
                    return;
                }
                this.setSwitch('active_plan_id', activePlanId, true);
                this.setState({ originalDataString });
                if (data === 'empty') {
                    return;
                }
                switch (method) {
                    case 'URL':
                        toast.success('Loaded plan from URL');
                        break;
                    case 'Account':
                        toast.success(
                            'Loaded plan: ' + Account.getPlanName(activePlanId)
                        );
                        break;
                    case 'Storage':
                        toast.success('Loaded recently edited plan');
                        break;
                }
                this.setState({ data });
            })
            .catch((error: PlanError) => {
                this.showAlert(
                    Utility.errorAlert('account_initial_login', error.message)
                );
            })
            .finally(() => {
                callback();
                d('plan initialized');
            });
    }

    componentDidUpdate(_: Readonly<{}>, prevState: Readonly<AppState>) {
        if (prevState.unsavedChanges !== this.state.unsavedChanges) {
            if (this.state.unsavedChanges) {
                d('there are now unsaved changes');
                window.onbeforeunload = () => {
                    return true;
                };
            } else {
                d('there are no longer unsaved changes');
                window.onbeforeunload = null;
            }
        }
    }

    setSwitch(key: string, val: UserOptionValue, save = false) {
        let switches = this.state.switches;
        if (
            key === 'active_plan_id' &&
            val === 'None' &&
            switches.get[key] !== val
        ) {
            this.setState({ unsavedChanges: false });
        }
        switches.get[key] = val;
        this.setState({ switches: switches });
        if (save) {
            Utility.saveSwitchToStorage(key, val?.toString());
        }
        d('switch set: %s = %s', key, val);
    }

    showAlert(alertData: AlertData) {
        this.setState({ alertData });
    }

    postShowAlert() {
        this.setState({ alertData: undefined });
    }

    courseConfirmationPrompts(
        course: Course,
        { year, quarter }: CourseLocation,
        confirmationCallback: () => void,
        ignoreExistCheck = false
    ) {
        let data = this.state.data;
        let isPlaceholder = course.placeholder;
        let repeatable = course.repeatable;

        let exists = CourseManager.duplicateCourse(course, data);

        if (!repeatable && exists && !isPlaceholder && !ignoreExistCheck) {
            this.showAlert({
                title: 'Curso já planejado.',
                message: `Você já tem ${
                    course.id
                } no seu plano durante o ${Utility.convertQuarter(
                    exists.quarter
                ).title.toLowerCase()} quarto do seu ${Utility.convertYear(
                    exists.year
                ).toLowerCase()} year.`,
                cancelButton: 'Voltar',
                confirmButton: 'Add mesmo assim',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    confirmationCallback();
                },
            });
            return;
        }

        let unitCount =
            CourseManager.getQuarterCredits(data.courses[year][quarter]) +
            parseFloat(course.units);

        if (unitCount > 7.5) {
            this.showAlert({
                title: 'Não concorda que tem muitas materias nesse semestre?',
                message: `Com este planejamento, você terá ${unitCount} disciplinas neste semestre, muito acima do normal`,
                cancelButton: 'Voltar',
                confirmButton: 'Add Mesmo Assim',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    confirmationCallback();
                },
            });
            return;
        }

        confirmationCallback();
    }

    addCourse(course: Course, location: CourseLocation) {
        this.courseConfirmationPrompts(course, location, () => {
            let data = this.state.data;
            let { year, quarter } = location;
            data.courses[year][quarter].push(course);
            data.courses[year][quarter].sort((a, b) => {
                if (a.placeholder) return 1;
                if (b.placeholder) return -1;
                return a.id.localeCompare(b.id);
            });

            d('curso adicionado: %s (y%dq%d)', course.id, year, quarter);
            this.setState({
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    this.state.switches,
                    this.state.originalDataString
                ),
            });
        });
    }

    removeCourse(course: Course, { year, quarter }: CourseLocation) {
        if (year < 0) {
            this.removeBookmark(course, quarter === 1);
            return;
        }
        let data = this.state.data;
        data.courses[year][quarter].splice(
            data.courses[year][quarter].indexOf(course),
            1
        );
        d('curso removido: %s (y%dq%d)', course.id, year, quarter);
        this.setState({
            data,
            unsavedChanges: CourseManager.save(
                data,
                this.state.switches,
                this.state.originalDataString
            ),
        });
    }

    moveCourse(
        course: Course,
        oldLocation: CourseLocation,
        newLocation: CourseLocation
    ) {
        let { year: oy, quarter: oq } = oldLocation;
        let { year: ny, quarter: nq } = newLocation;
        if (oy === ny && oq === nq) return;

        this.courseConfirmationPrompts(
            course,
            newLocation,
            () => {
                if (oy >= 0) {
                    let data = this.state.data;
                    data.courses[oy][oq].splice(
                        data.courses[oy][oq].indexOf(course),
                        1
                    );
                }
                let data = this.state.data;
                data.courses[ny][nq].push(course);
                data.courses[ny][nq].sort((a, b) => {
                    if (a.placeholder) return 1;
                    if (b.placeholder) return -1;
                    return a.id.localeCompare(b.id);
                });

                d(
                    'curso movido: %s (y%dq%d) -> (y%dq%d)',
                    course.id,
                    oy,
                    oq,
                    ny,
                    nq
                );
                this.setState({
                    data,
                    unsavedChanges: CourseManager.save(
                        data,
                        this.state.switches,
                        this.state.originalDataString
                    ),
                });
            },
            true
        );
    }

    addBookmark(course: Course, forCredit: boolean) {
        let bookmarks = this.state.data.bookmarks;
        if (forCredit) {
            bookmarks.forCredit.add(course);
        } else {
            bookmarks.noCredit.add(course);
        }

        d('marcador adicionado: %s (credit = %s)', course.id, forCredit.toString());
        this.setState((prevState) => {
            const data = {
                ...prevState.data,
                bookmarks: bookmarks,
            };
            return {
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    this.state.switches,
                    prevState.originalDataString
                ),
            };
        });
    }

    removeBookmark(course: Course, forCredit: boolean) {
        let bookmarks = this.state.data.bookmarks;
        if (forCredit) {
            bookmarks.forCredit.delete(course);
        } else {
            bookmarks.noCredit.delete(course);
        }

        d(
            'marcador removido: %s (credit = %s)',
            course.id,
            forCredit.toString()
        );
        this.setState((prevState) => {
            const data = {
                ...prevState.data,
                bookmarks: bookmarks,
            };
            return {
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    prevState.switches,
                    prevState.originalDataString
                ),
            };
        });
    }

    addSummerQuarter(year: number) {
        this.showAlert({
            title: 'Adicionar mais um periodo?',
            message: `Isso adicionará mais um periodo ao ${Utility.convertYear(
                year
            ).toLowerCase()}. Você pode removê-lo removendo todas as aulas daquele Periodo e atualizando a página.`,
            confirmButton: 'Add Periodo',
            confirmButtonColor: 'yellow',
            cancelButton: 'Fechar',
            iconBackgroundColor: 'yellow',
            icon: (
                <PlusIcon
                    className="h-6 w-6 text-yellow-600"
                    aria-hidden="true"
                />
            ),
            action: () => {
                let data = this.state.data;
                data.courses[year].push([]);
                this.setState({ data: data });
                d('Add Periodo: y%d', year);
            },
        });
    }

    addYear() {
        let data = this.state.data;
        data.courses.push([[], [], []]);
        this.setState({ data: data });
        d('Ano Add: y%d', data.courses.length);
    }

    clearData(year?: number) {
        let data;
        if (year === undefined) {
            data = {
                courses: [
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                ],
                bookmarks: {
                    forCredit: new Set<Course>(),
                    noCredit: new Set<Course>(),
                },
            };
            d('plan cleared');
            this.setState({
                data,
                unsavedChanges: CourseManager.save(
                    data,
                    this.state.switches,
                    this.state.originalDataString
                ),
            });
        } else {
            const yearText = Utility.convertYear(year).toLowerCase();
            this.showAlert({
                title: 'Voltar esse ano ao Padrão?',
                message: `Todos as disciplinas do ${yearText} serão removidos.`,
                cancelButton: 'Cancelar',
                confirmButton: 'Limpar',
                confirmButtonColor: 'red',
                iconBackgroundColor: 'red',
                icon: (
                    <TrashIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    let oldData = this.state.data;
                    let courses = this.state.data.courses;
                    courses[year] = [[], []];
                    data = { courses: courses, bookmarks: oldData.bookmarks };
                    d('Ano voltou ao padrão: y%d', year);
                    toast.success(`Resetou o seu ${yearText}`, {
                        iconTheme: {
                            primary: 'red',
                            secondary: 'white',
                        },
                    });
                    this.setState({
                        data,
                        unsavedChanges: CourseManager.save(
                            data,
                            this.state.switches,
                            this.state.originalDataString
                        ),
                    });
                },
            });
        }
    }

    activateAccountPlan(planId: string) {
        d('plan activating: %s', planId);
        Account.getPlans()
            .then((plans) => {
                if (!plans) {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Undefined Plans'
                        )
                    );
                    return;
                }
                let plan = plans[planId];
                if (!plan) {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Undefined Plan'
                        )
                    );
                    return;
                }
                let data = CourseManager.loadFromString(plan.content);
                if (data === 'malformed') {
                    this.showAlert(
                        Utility.errorAlert(
                            'account_activate_plan',
                            'Malformed Plan'
                        )
                    );
                    return;
                }

                if (data === 'empty') {
                    this.setSwitch('active_plan_id', planId, true);
                    this.setState({
                        originalDataString: plan.content,
                        unsavedChanges: window.location.search.length > 0,
                    });
                    toast.success(
                        'Activated plan: ' + Account.getPlanName(planId)
                    );
                    d('plan activated: %s (empty)', planId);
                    return;
                }

                let confirmNonAccountOverwrite =
                    this.state.switches.get.active_plan_id === 'None' &&
                    window.location.search.length > 0;

                this.discardChanges(() => {
                    this.setSwitch('active_plan_id', planId, true);
                    this.setState(
                        {
                            data: data as PlanData,
                            originalDataString: plan.content,
                        },
                        () => {
                            CourseManager.save(data as PlanData);
                            toast.success(
                                'Activated plan: ' + Account.getPlanName(planId)
                            );
                            d('plan activated: %s', planId);
                        }
                    );
                }, confirmNonAccountOverwrite);
            })
            .catch((error: PlanError) => {
                this.showAlert(
                    Utility.errorAlert('account_activate_plan', error.message)
                );
            });
    }

    deactivatePlan() {
        this.discardChanges(() => {
            let planId = this.state.switches.get.active_plan_id;
            this.setSwitch('active_plan_id', 'None', true);
            toast.success('Deactivated plan', {
                iconTheme: {
                    primary: 'red',
                    secondary: 'white',
                },
            });
            d('plan deactivated: %s', planId);
        });
    }

    updatePlan() {
        let activePlanId = this.state.switches.get.active_plan_id;
        if (!activePlanId || activePlanId === 'None') {
            this.showAlert(
                Utility.errorAlert('account_update_plan', 'No Active Plan')
            );
            return;
        }

        const dataStr = CourseManager.getDataString(this.state.data);
        this.setState({ unsavedChanges: false });

        let self = this;
        toast.promise(Account.updatePlan(activePlanId as string, dataStr), {
            loading: 'Salvando...',
            success: () => {
                self.setState({
                    originalDataString: dataStr,
                });
                return 'Salvou' + Account.getPlanName(activePlanId as string);
            },
            error: (err) => {
                this.setState({ unsavedChanges: true });
                this.showAlert(
                    Utility.errorAlert('account_update_plan', err.message)
                );
                return 'algo deu errado';
            },
        });
    }

    discardChanges(
        action: () => void,
        confirmNonAccountOverwrite: boolean = false
    ) {
        let message = confirmNonAccountOverwrite
            ? 'Parece que você já tem alguns dados em seu plano. A ativação deste plano não vazio substituirá esses dados. Tem certeza?'
            : 'Parece que você tem algumas alterações não salvas. Navegar para fora fará com que eles não sejam salvos em sua conta. Tem certeza?';

        if (confirmNonAccountOverwrite || this.state.unsavedChanges) {
            this.showAlert({
                title: 'Espere...',
                message,
                confirmButton: 'Sim, Continue',
                confirmButtonColor: 'red',
                cancelButton: 'Voltar',
                iconBackgroundColor: 'red',
                icon: (
                    <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                    />
                ),
                action: () => {
                    this.setState({ unsavedChanges: false });
                    action();
                },
            });
            return;
        }

        action();
    }

    render() {
        let switches = this.state.switches;
        let tab = switches.get.tab;
        let darkMode = switches.get.dark;
        return (
            <DndProvider backend={HTML5Backend}>
                {switches.get.notifications && (
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                minWidth: '12rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                backgroundColor: darkMode
                                    ? '#262626'
                                    : undefined,
                                color: darkMode ? '#ffffff' : undefined,
                            },
                        }}
                    />
                )}
                <MotionConfig
                    reducedMotion={
                        switches.get.reduced_motion ? 'always' : 'never'
                    }
                >
                    <div className={`${darkMode ? 'dark' : ''} relative`}>
                        {this.state.alertData && (
                            <Alert
                                data={this.state.alertData}
                                switches={switches}
                                onConfirm={(inputText?: string) => {
                                    let alertData = this.state.alertData;
                                    if (alertData?.action) {
                                        alertData.action(inputText);
                                    }
                                }}
                                onClose={() => {
                                    this.postShowAlert();
                                }}
                            />
                        )}

                        <div className="bg-white dark:bg-gray-800 grid grid-cols-1 lg:grid-cols-8">
                            <div className="col-span-2 px-4 h-192 md:h-screen flex flex-col">
                                <Info />
                                <Search
                                    data={this.state.data}
                                    switches={switches}
                                    f={this.state.f}
                                />
                                {tab === 'My List' && (
                                    <Bookmarks
                                        bookmarks={this.state.data.bookmarks}
                                        alert={(alertData) => {
                                            this.showAlert(alertData);
                                        }}
                                        f={this.state.f}
                                        switches={switches}
                                    />
                                )}
                                {tab === 'Plans' && (
                                    <AccountPlans
                                        data={this.state.data}
                                        switches={this.state.switches}
                                        alert={(alertData) => {
                                            this.showAlert(alertData);
                                        }}
                                        activatePlan={(planId) => {
                                            this.activateAccountPlan(planId);
                                        }}
                                        deactivatePlan={() => {
                                            this.deactivatePlan();
                                        }}
                                        activePlanId={
                                            switches.get
                                                .active_plan_id as string
                                        }
                                    />
                                )}
                                <TaskBar
                                    alert={(alertData) => {
                                        this.showAlert(alertData);
                                    }}
                                    version={VERSION}
                                    switches={switches}
                                    f2={this.state.f2}
                                    tabLoading={this.state.loadingLogin}
                                />
                            </div>

                            <div
                                className={`${
                                    switches.get.compact ? 'compact-mode ' : ''
                                } col-span-6 block pt-0 lg:h-screen lg:overflow-y-scroll no-scrollbar`}
                            >
                                <Content
                                    data={this.state.data}
                                    f={this.state.f}
                                    f2={this.state.f2}
                                    alert={(alertData) => {
                                        this.showAlert(alertData);
                                    }}
                                    switches={switches}
                                />
                            </div>
                        </div>
                        <AnimatePresence>
                            {this.state.unsavedChanges && (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    className={`fixed right-12 ${
                                        switches.get.save_location_top
                                            ? 'top-8'
                                            : 'bottom-8'
                                    }`}
                                >
                                    <button
                                        className="flex items-center gap-2 rainbow-border-button shadow-lg opacity-75 hover:opacity-100 focus:before:bg-none focus:before:bg-emerald-400
                                            after:bg-gray-100 text-black dark:after:bg-gray-700 dark:text-white"
                                        onClick={() => {
                                            this.updatePlan();
                                        }}
                                    >
                                        <>
                                            <SaveIcon className="h-6 w-6 inline-block" />
                                            <p className="inline-block text-lg font-extrabold">
                                                SALVAR
                                            </p>
                                        </>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </MotionConfig>
            </DndProvider>
        );
    }
}

export default App;
