import { Color } from '../../types/BaseTypes';
import { Course } from '../../types/PlanTypes';
import Utility from '../../utility/Utility';

interface AddButtonProps {
    color: Color;
    action: () => void;
    text: string;
}

function AddButton(props: AddButtonProps) {
    return (
        <button
            className={`text-center bg-${props.color}-400 text-white font-medium p-2 block
        mx-auto w-2/3 rounded-md opacity-100 hover:opacity-60 shadow-sm transition-all duration-150 my-2`}
            onClick={() => {
                props.action();
            }}
        >
            {props.text}
        </button>
    );
}

interface AddButtonSectionProps {
    title: string;
    size: number;
    action: (quarter: number) => void;
}

function AddButtonSection(props: AddButtonSectionProps) {
    let withSummer = (
        <div className="grid grid-cols-3 gap-0">
            <AddButton
                text="Fa"
                color="lime"
                action={() => {
                    props.action(0);
                }}
            />
            <AddButton
                text="Wi"
                color="sky"
                action={() => {
                    props.action(1);
                }}
            />
            <AddButton
                text="Sp"
                color="orange"
                action={() => {
                    props.action(2);
                }}
            />
            <AddButton
                text="Su"
                color="yellow"
                action={() => {
                    props.action(3);
                }}
            />
        </div>
    );

    let withoutSummer = (
        <div className="grid grid-cols-2 gap-0">
            <AddButton
                text="1º Semestre"
                color="lime"
                action={() => {
                    props.action(0);
                }}
            />
            <AddButton
                text="2º Semestre"
                color="sky"
                action={() => {
                    props.action(1);
                }}
            />
        </div>
    );

    return (
        <div className="py-2">
            <p className="text-center text-gray-500 font-bold p-2 text-sm">
                {props.title}
            </p>
            {props.size === 1 ? withSummer : withoutSummer}
        </div>
    );
}

interface AddButtonsProps {
    courses: Course[][][];
    action: (year: number, quarter: number) => void;
}

function AddButtons(props: AddButtonsProps) {
    let courses = props.courses;
    let years = courses.length;

    let sections = [];
    for (let y = 0; y < years; y++) {
        sections.push(
            <AddButtonSection
                title={Utility.convertYear(y)}
                size={courses[y].length}
                action={(quarter) => {
                    props.action(y, quarter);
                }}
                key={y}
            />
        );
    }

    return <div>{sections}</div>;
}

export default AddButtons;
