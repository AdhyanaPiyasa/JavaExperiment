// calculator.js
function Calculator() {
    const [firstNumber, setFirstNumber] = MiniReact.useState('');
    const [secondNumber, setSecondNumber] = MiniReact.useState('');
    const [operation, setOperation] = MiniReact.useState('ADD');
    const [result, setResult] = MiniReact.useState(null);
    const [error, setError] = MiniReact.useState(null);
    const [history, setHistory] = MiniReact.useState([]);

    const operations = {
        ADD: {
            symbol: '+',
            name: 'Add'
        },
        SUBTRACT: {
            symbol: '-',
            name: 'Subtract'
        },
        MULTIPLY: {
            symbol: '*',
            name: 'Multiply'
        },
        DIVIDE: {
            symbol: '/',
            name: 'Divide'
        }
    };

    const handleCalculate = async () => {
        try {
            const num1 = parseFloat(firstNumber);
            const num2 = parseFloat(secondNumber);

            if (isNaN(num1) || isNaN(num2)) {
                throw new Error('Please enter valid numbers');
            }

            if (operation === 'DIVIDE' && num2 === 0) {
                throw new Error('Cannot divide by zero');
            }

            const response = await fetch('http://localhost:8085/adhyana-demo/api/math/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstNumber: num1,
                    secondNumber: num2,
                    operation: operation
                })
            });

            if (!response.ok) {
                throw new Error('Calculation failed: ' + response.statusText);
            }

            const data = await response.json();

            // Add to history
            const newHistoryItem = {
                operation: operation,
                num1: num1,
                num2: num2,
                result: data.result,
                timestamp: new Date().toLocaleTimeString()
            };
            setHistory([newHistoryItem, ...history.slice(0, 4)]);

            setResult(data.result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    };

    const handleInputChange = (setter) => (event) => {
        if (event && event.target) {
            setter(event.target.value);
        }
    };

    const handleOperationChange = (event) => {
        if (event && event.target) {
            setOperation(event.target.value);
            setResult(null); // Clear result when operation changes
        }
    };

    return {
        type: 'div',
        props: {
            className: 'calculator',
            children: [
                {
                    type: 'h2',
                    props: {
                        children: ['Advanced Calculator']
                    }
                },
                {
                    type: 'select',
                    props: {
                        className: 'operation-select',
                        value: operation,
                        onchange: handleOperationChange,
                        children: Object.entries(operations).map(([key, value]) => ({
                            type: 'option',
                            props: {
                                value: key,
                                children: [`${value.name} (${value.symbol})`]
                            }
                        }))
                    }
                },
                {
                    type: 'div',
                    props: {
                        className: 'form-group',
                        children: [
                            {
                                type: 'label',
                                props: {
                                    htmlFor: 'firstNumber',
                                    children: ['First Number:']
                                }
                            },
                            {
                                type: 'input',
                                props: {
                                    id: 'firstNumber',
                                    type: 'number',
                                    value: firstNumber,
                                    onchange: handleInputChange(setFirstNumber),
                                    placeholder: 'Enter first number'
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'div',
                    props: {
                        className: 'form-group',
                        children: [
                            {
                                type: 'label',
                                props: {
                                    htmlFor: 'secondNumber',
                                    children: ['Second Number:']
                                }
                            },
                            {
                                type: 'input',
                                props: {
                                    id: 'secondNumber',
                                    type: 'number',
                                    value: secondNumber,
                                    onchange: handleInputChange(setSecondNumber),
                                    placeholder: 'Enter second number'
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'button',
                    props: {
                        className: 'button',
                        onclick: handleCalculate,
                        children: ['Calculate']
                    }
                },
                result !== null && {
                    type: 'div',
                    props: {
                        className: 'result success',
                        children: [`Result: ${result}`]
                    }
                },
                error !== null && {
                    type: 'div',
                    props: {
                        className: 'result error',
                        children: [`Error: ${error}`]
                    }
                },
                history.length > 0 && {
                    type: 'div',
                    props: {
                        className: 'history',
                        children: [
                            {
                                type: 'h3',
                                props: {
                                    children: ['Calculation History']
                                }
                            },
                            ...history.map(item => ({
                                type: 'div',
                                props: {
                                    className: 'history-item',
                                    children: [`${item.timestamp}: ${item.num1} ${operations[item.operation].symbol} ${item.num2} = ${item.result}`]
                                }
                            }))
                        ]
                    }
                }
            ].filter(Boolean)
        }
    };
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        MiniReact.currentComponent = {
            hooks: [],
            hookIndex: 0,
            element: Calculator,
            container: root
        };
        MiniReact.render(Calculator(), root);
    }
});