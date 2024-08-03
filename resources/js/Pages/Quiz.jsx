// import React, { useState, useEffect } from 'react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head} from '@inertiajs/react';
// import axios from 'axios';
// export default function Quiz({auth}) {
//     const [question, setQuestion] = useState('');
//     const [options, setOptions] = useState([]);

//     useEffect(() => {
//         const channel = window.Echo.channel('quiz');
//         channel.listen('QuizEvent', (event) => {
//             setQuestion(event.question);
//             setOptions(event.options);
//         });

//         console.log(auth.user)

//         return () => {
//             channel.stopListening('QuizEvent');
//         };
//     }, []);

//     const selectAnswer = (answer) => {
//         console.log('Selected answer:', answer);
//         // Implement answer submission logic here
//     };
//     const startQuiz = () => {
//         axios.post('/start-quiz')
//             .then(response => {
//                 console.log('Quiz started:', response.data);
//                 // You could update some state here if needed
//                 // setQuizStarted(true);
//             })
//             .catch(error => {
//                 console.error('Error starting quiz:', error);
//             });
//     };
//     return (
//         <AuthenticatedLayout
//         user={auth.user}
//         header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quiz</h2>}
//         >
//             <Head title='Quiz'/>
//             <div className="quiz-container">
//                 <form onSubmit={startQuiz}>
//                     <button type="submit">Start Quiz</button>
//                 </form>
//                 <h2>Question: {question}</h2>
//                 <ul>
//                     Answers:
//                     {options.map((option, index) => (
//                         <li key={index}>
//                             <button onClick={() => selectAnswer(option)}>{option}</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Quiz({ auth }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const channel = window.Echo.channel('quiz');
    //     channel.listen('QuizEvent', (event) => {
    //         setQuestion(event.question);
    //         setOptions(event.options);
    //     });

    //     console.log(auth.user);

    //     return () => {
    //         channel.stopListening('QuizEvent');
    //     };
    // }, []);
    useEffect(() => {
        console.log('Setting up Echo listener');
        const channel = window.Echo.channel('quiz');
        channel.listen('.QuizEvent', (event) => {
            console.log('Received QuizEvent:', event);
            setQuestion(event.question);
            setOptions(event.options);
        }).error((error) => {
            console.error('Echo error:', error);
        });
    
        return () => {
            console.log('Cleaning up Echo listener');
            channel.stopListening('.QuizEvent');
        };
    }, []);

    const selectAnswer = (answer) => {
        console.log('Selected answer:', answer);
        // Implement answer submission logic here
    };

    const startQuiz = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('/start-quiz')
            .then(response => {
                console.log('Quiz started:', response.data);
                setLoading(false);
                // Manually trigger the event for testing
               
            })
            .catch(error => {
                console.error('Error starting quiz:', error);
                setLoading(false);
            });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quiz</h2>}
        >
            <Head title="Quiz" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="quiz-container">
                                <form onSubmit={startQuiz}>
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                                        {loading ? 'Starting...' : 'Start Quiz'}
                                    </button>
                                </form>
                                {loading && <p>Loading quiz...</p>}
                                {!loading && question && (
                                    <>
                                        <h2 className="mt-4 text-lg font-semibold">Question: {question}</h2>
                                        <ul className="mt-2">
                                            {options.map((option, index) => (
                                                <li key={index} className="mt-2">
                                                    <button 
                                                        onClick={() => selectAnswer(option)}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                                                    >
                                                        {option}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}