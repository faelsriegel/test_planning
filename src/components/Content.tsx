import { PlusIcon } from '@heroicons/react/outline';
import React from 'react';
import CourseManager from '../CourseManager';
import { Alert } from '../types/AlertTypes';
import { UserOptions } from '../types/BaseTypes';
import {
    PlanData,
    PlanModificationFunctions,
    PlanSpecialFunctions,
} from '../types/PlanTypes';
import Utility from '../utility/Utility';
import Year from './Year';

interface ContentProps {
    data: PlanData;
    f: PlanModificationFunctions;
    f2: PlanSpecialFunctions;
    alert: Alert;
    switches: UserOptions;
}
class Content extends React.Component<ContentProps> {
    render() {
        let content = this.props.data;
        let years: JSX.Element[] = [];
        if (content.courses) {
            years = content.courses.map((year, index) => {
                return (
                    <Year
                        data={year}
                        bookmarks={this.props.data.bookmarks}
                        year={index}
                        f={this.props.f}
                        f2={this.props.f2}
                        alert={this.props.alert}
                        switches={this.props.switches}
                        title={Utility.convertYear(index)}
                        key={index}
                    />
                );
            });
        }

        let units = CourseManager.getTotalCredits(content);

        let unitString = 'Disciplinas';
        if (units === 1) {
            unitString = 'Disiciplina';
        }

        return (
            <div className="bg-white dark:bg-gray-800">
                {years}
                <div className="flex m-5 justify-center gap-4">
                    <div className="border-2 border-gray-200 rounded-lg p-1 w-48 dark:border-gray-600 shadow-sm">
                        <p className="text-center text-sm font-light text-gray-400 dark:text-gray-400">
                            <span className="font-medium">{units}</span> Total de{' '}
                            {unitString}
                        </p>
                    </div>
                    {content.courses.length < 10 && (
                        <button
                            className="block px-5 py-1 bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-500
                            dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300 transition-all duration-150 rounded-lg shadow-sm"
                            onClick={() => {
                                this.props.alert({
                                    title: 'Adicionar um mais um ano?',
                                    message:
                                        'Isso adicionará mais um ano ao seu planejamento. Você pode removê-lo removendo todas as aulas daquele ano e atualizando a página.',
                                    confirmButton: 'Add Ano',
                                    confirmButtonColor: 'cyan',
                                    cancelButton: 'Fechar',
                                    iconBackgroundColor: 'cyan',
                                    icon: (
                                        <PlusIcon
                                            className="h-6 w-6 text-cyan-600"
                                            aria-hidden="true"
                                        />
                                    ),
                                    action: () => {
                                        this.props.f2.addYear();
                                    },
                                });
                            }}
                        >
                            Adicionar Ano
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Content;
