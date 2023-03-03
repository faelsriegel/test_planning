import React from 'react';

class Info extends React.Component {
    render() {
        return (
            <div className="flex items-center justify-center my-4 px-4 py-3 text-black text-center whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-2 border-black-800 rounded-3xl dark:border-green-300">
                <a href="/">
          <img src="../calendar-solid.png" alt="Logo" />
                </a>
                <p className="text-2xl font-normal #6bc781 dark:text-green-300">
                    TESTE Planning SAPU
                </p>
            </div>
        );
    }
}

export default Info;
