// miniReact.js
const MiniReact = {
    createElement(type, props = {}, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children
                    .flat()
                    .map(child =>
                        child === null || child === undefined
                            ? createTextElement('')
                            : typeof child === 'object'
                                ? child
                                : createTextElement(child)
                    ),
            },
        };
    },

    render(element, container) {
        if (!element || !container) return;

        // Handle text elements
        if (typeof element === 'string' || typeof element === 'number') {
            container.appendChild(document.createTextNode(String(element)));
            return;
        }

        if (!element.type) return;

        // Create DOM element
        const dom = element.type instanceof Function
            ? document.createElement('div')
            : document.createElement(element.type);

        // Add event listeners and set properties
        if (element.props) {
            Object.entries(element.props).forEach(([name, value]) => {
                if (!value) return;

                if (name.startsWith('on') && typeof value === 'function') {
                    const eventName = name.toLowerCase().substring(2);
                    dom.addEventListener(eventName, value);
                } else if (name === 'className') {
                    dom.setAttribute('class', value);
                } else if (name !== 'children') {
                    dom.setAttribute(name, value);
                }
            });
        }

        // Handle component functions
        if (element.type instanceof Function) {
            const componentElement = element.type(element.props || {});
            MiniReact.render(componentElement, dom);
        } else if (element.props && element.props.children) {
            // Render children
            element.props.children.forEach(child => {
                if (child) MiniReact.render(child, dom);
            });
        }

        container.appendChild(dom);
    },

    useState(initialValue) {
        if (!MiniReact.currentComponent) {
            MiniReact.currentComponent = {
                hooks: [],
                hookIndex: 0,
                element: null,
                container: null
            };
        }

        const hooks = MiniReact.currentComponent.hooks;
        const index = MiniReact.currentComponent.hookIndex++;

        if (hooks[index] === undefined) {
            hooks[index] = initialValue;
        }

        const setState = (newValue) => {
            hooks[index] = newValue;
            MiniReact.rerender();
        };

        return [hooks[index], setState];
    },

    currentComponent: null,

    rerender() {
        if (!MiniReact.currentComponent || !MiniReact.currentComponent.container) return;

        const { element, container } = MiniReact.currentComponent;
        container.innerHTML = '';
        MiniReact.currentComponent.hookIndex = 0;
        const newElement = element();
        MiniReact.render(newElement, container);
    }
};

function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

window.MiniReact = MiniReact;