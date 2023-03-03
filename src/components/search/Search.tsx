import React from 'react';
import SearchClass from './SearchClass';
import AddButtons from './AddButtons';
import CourseManager from '../../CourseManager';
import {
    SearchIcon,
    ArrowRightIcon,
    DotsHorizontalIcon,
    CollectionIcon,
    ExternalLinkIcon,
} from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import {
    Course,
    PlanData,
    PlanModificationFunctions,
    SearchResultsElements,
    SearchShortcut,
} from '../../types/PlanTypes';
import { UserOptions } from '../../types/BaseTypes';

interface MiniContentBlockProps {
    icon: JSX.Element;
    title: string;
    text: string;
}

function MiniContentBlock(props: MiniContentBlockProps) {
    return (
        <div className="text-center p-4">
            <div className="mx-auto my-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {props.icon}
            </div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {props.title}
            </p>
            <p className="text-sm font-light text-gray-400 dark:text-gray-500">
                {props.text}
            </p>
        </div>
    );
}

interface SearchProps {
    data: PlanData;
    switches: UserOptions;
    f: PlanModificationFunctions;
}

interface SearchState {
    search: string;
    current?: Course;
    shortcut?: SearchShortcut;
}

class Search extends React.Component<SearchProps, SearchState> {
    searchFieldRef: React.RefObject<HTMLInputElement>;

    constructor(props: SearchProps) {
        super(props);

        this.state = { search: '' };
        this.searchFieldRef = React.createRef();
    }

    searchMessage(title: string, subtitle: string) {
        return (
            <div
                className="text-center text-gray-600 dark:text-gray-400 px-4"
                key="search-message"
            >
                <p className="text-lg font-medium">{title}</p>
                <p className="text-sm font-light">{subtitle}</p>
            </div>
        );
    }

    getResults(): SearchResultsElements {
        let query = this.state.search;

        if (query.length === 0) {
            return {
                results: [
                    <div key="no-query">
                        <MiniContentBlock
                            icon={<SearchIcon className="w-6 h-6" />}
                            title="Procurar"
                            text="Use a barra de pesquisa para pesquisar todos os cursos e ver informações detalhadas de cada um."
                        />
                        <MiniContentBlock
                            icon={<ArrowRightIcon className="w-6 h-6" />}
                            title="Arrastar"
                            text="Arraste os cursos desta área de pesquisa para o trimestre desejado. Como alternativa, você pode clicar no curso e selecionar o trimestre ao qual deseja adicioná-lo."
                        />
                        <MiniContentBlock
                            icon={<CollectionIcon className="w-6 h-6" />}
                            title="Salvar"
                            text="Crie facilmente uma conta para salvar vários planos e acessá-los de qualquer lugar."
                        />
                        <MiniContentBlock
                            icon={<ExternalLinkIcon className="w-6 h-6" />}
                            title="Compartilhar"
                            text="A URL é atualizada conforme você modifica seu plano. Compartilhe-o com outras pessoas e elas terão uma cópia que poderão visualizar e editar."
                        />
                    </div>,
                ],
            };
        }

        let results = CourseManager.search(query);
        if (results === 'too_short') {
            return {
                results: [
                    this.searchMessage(
                        'Continue digitando...',
                        `Você precisará de pelo menos 3 caracteres.`
                    ),
                ],
            };
        }

        if (results === 'no_results') {
            return {
                results: [
                    this.searchMessage(
                        'Sem resultados.',
                        `Tente refinar sua pesquisa.`
                    ),
                ],
            };
        }

        let courseList = [];
        for (let course of results.results) {
            courseList.push(
                <SearchClass
                    course={course}
                    color={CourseManager.getCourseColor(course.id)}
                    select={(course) => {
                        this.setState({ current: course });
                    }}
                    bookmarks={this.props.data.bookmarks}
                    f={this.props.f}
                    key={course.id}
                />
            );
        }

        if (results.limitExceeded) {
            courseList.push(
                <MiniContentBlock
                    icon={<DotsHorizontalIcon className="w-6 h-6" />}
                    title={`and ${results.limitExceeded} more.`}
                    text="Há muitos resultados para exibir. Você precisará restringir sua pesquisa para obter mais."
                    key="too-many"
                />
            );
        }

        return {
            results: courseList,
            shortcut: results.shortcut,
        };
    }

    render() {
        let singleClassView = false;
        let search = this.state.search;

        let { results, shortcut } = this.getResults();

        let searchField = (
            <div className="sticky top-0 p-2 mb-2 bg-white dark:bg-gray-800 z-10 rounded-lg">
                <div className="block mt-4 mb-2 mx-auto w-11/12 relative">
                    <input
                        className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-md
                            rounded-lg outline-none hover:border-gray-500 focus:border-black dark:hover:border-gray-400 dark:focus:border-white text-lg p-2 px-4
                            transition-all duration-150 text-black dark:text-white"
                        ref={this.searchFieldRef}
                        value={search}
                        placeholder="Procurar pelas disciplinas..."
                        onChange={(event) => {
                            this.setState({ search: event.target.value });
                        }}
                    />
                    {search.length > 0 && (
                        <button
                            className="block absolute right-4 top-0 bottom-0 my-2 text-gray-300 hover:text-red-400 focus:text-red-300 
                            dark:text-gray-600 dark:hover:text-red-400 dark:focus:text-red-500 transition-colors duration-150"
                            onClick={() => {
                                this.setState({ search: '' });
                                this.searchFieldRef.current?.focus();
                            }}
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {shortcut && (
                    <p className="text-center text-sm m-0 p-0 text-gray-500 dark:text-gray-400">
                        replacing{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.replacing}
                        </span>{' '}
                        with{' '}
                        <span className="text-black dark:text-white font-medium">
                            {shortcut.with}
                        </span>
                    </p>
                )}
            </div>
        );

        let selectedClass = null;
        let addButtons = null;
        let bookmarksButtons = null;
        let exitButton = null;

        let current = this.state.current;
        if (current) {
            singleClassView = true;

            selectedClass = (
                <SearchClass
                    course={current}
                    color={CourseManager.getCourseColor(current.id)}
                />
            );

            addButtons = (
                <AddButtons
                    action={(year, quarter) => {
                        if (current) {
                            this.props.f.addCourse(current, { year, quarter });
                            this.setState({ current: undefined });
                        }
                    }}
                    courses={this.props.data.courses}
                />
            );

            let bookmarks = this.props.data.bookmarks;

            bookmarksButtons = (
                <div className="py-2">
                    <p className="text-center text-gray-500 font-bold p-2 text-sm">
                        MINHA LISTA
                    </p>
                    <button
                        className="block mx-auto bg-indigo-500 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                        onClick={() => {
                            if (!current) return;
                            if (bookmarks.noCredit.has(current)) {
                                this.props.f.removeBookmark(current, false);
                            } else {
                                this.props.f.addBookmark(current, false);
                            }
                        }}
                    >
                        {bookmarks.noCredit.has(current)
                            ? 'Remove from bookmarks'
                            : 'Add to bookmarks'}
                    </button>
                    <button
                        className="block mx-auto bg-indigo-800 dark:bg-indigo-400 text-white font-medium w-4/5 p-0.5 my-2 opacity-100 hover:opacity-60
                            transition-all duration-150 rounded-md shadow-sm"
                        onClick={() => {
                            if (!current) return;
                            if (bookmarks.forCredit.has(current)) {
                                this.props.f.removeBookmark(current, true);
                            } else {
                                this.props.f.addBookmark(current, true);
                            }
                        }}
                    >
                        {bookmarks.forCredit.has(current)
                            ? 'Remove for credit'
                            : 'Add for credit'}
                    </button>
                </div>
            );

            exitButton = (
                <button
                    className="block mx-auto my-8 bg-gray-500 text-white font-medium
                        w-4/5 p-2 opacity-100 hover:opacity-60 transition-all duration-150 rounded-md shadow-sm"
                    onClick={() => {
                        this.setState({ current: undefined });
                    }}
                >
                    Voltar
                </button>
            );
        }

        return (
            <div
                className={`${
                    this.props.switches.get.tab === 'Search' ? '' : 'hidden '
                }border-4 border-gray-400 dark:border-gray-500 my-2 rounded-lg shadow-lg h-full
                overflow-y-scroll no-scrollbar`}
            >
                {!singleClassView && searchField}
                {!singleClassView && results}

                {singleClassView && selectedClass}
                {singleClassView && addButtons}
                {singleClassView && bookmarksButtons}
                {singleClassView && exitButton}
            </div>
        );
    }
}

export default Search;
