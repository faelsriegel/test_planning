import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/outline';
import {
    AccountModificationFunctions,
    AccountPlanData,
} from '../../types/AccountTypes';

interface AccountPlanProps {
    id: string;
    plan: AccountPlanData;
    fa: AccountModificationFunctions;
    active: boolean;
}

const variants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
};

function AccountPlan(props: AccountPlanProps) {
    let id = props.id;
    let plan = props.plan;
    return (
        <motion.div variants={variants}>
            <div
                tabIndex={0}
                className={`block border-2 ${
                    props.active
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-rose-400 bg-rose-50'
                }  dark:bg-gray-800 w-full my-4 text-left px-4 py-8 rounded-lg text-black
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1
            focus:shadow-inner focus:translate-y-0 group cursor-pointer`}
                onClick={() => {
                    if (props.active) {
                        props.fa.deactivatePlan();
                    } else {
                        props.fa.activatePlan(id);
                    }
                }}
            >
                <p className="text-lg font-semibold text-black dark:text-white">
                    {plan.name.toUpperCase()}
                </p>
                <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                    Last updated{' '}
                    {plan.lastUpdated
                        ? new Date(plan.lastUpdated).toLocaleDateString()
                        : 'N/A'}
                </p>
                <button
                    className="absolute -top-2 -right-2 p-0.5 rounded-full bg-gray-200 hover:bg-red-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.fa.deletePlan(id, plan.name);
                    }}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                {props.active ? (
                    <p className="absolute bottom-1 right-2 font-bold text-green-400">
                        Ativo
                    </p>
                ) : (
                    !plan.content && (
                        <p className="absolute bottom-1 right-2 font-bold text-rose-300">
                            Vazio
                        </p>
                    )
                )}
            </div>
        </motion.div>
    );
}

export default AccountPlan;
