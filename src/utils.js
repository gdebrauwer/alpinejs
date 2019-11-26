
export function walk(el, callback) {
    callback(el)

    let node = el.firstElementChild

    while (node) {
        walk(node, callback)
        node = node.nextElementSibling
    }
}

export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `var result; with($data) { result = ${expression} }; return result`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    return (new Function(['$data', ...Object.keys(additionalHelperVariables)], `with($data) { ${expression} }`))(
        dataContext, ...Object.values(additionalHelperVariables)
    )
}

export function isXAttr(attr) {
    const xAttrRE = /x-(on|bind|data|text)/

    return xAttrRE.test(attr.name)
}

export function getXAttrs(el, name) {
    return Array.from(el.attributes)
        .filter(isXAttr)
        .map(attr => {
            const typeMatch = attr.name.match(/x-(on|bind|data|text)/)
            const valueMatch = attr.name.match(/:([a-zA-Z\-]+)/)
            const modifiers = attr.name.match(/\.[^.\]]+(?=[^\]]*$)/g) || []

            return {
                type: typeMatch ? typeMatch[1] : null,
                value: valueMatch ? valueMatch[1] : null,
                modifiers: modifiers.map(i => i.replace('.', '')),
                expression: attr.value,
            }
        })
        .filter(i => i.type === name)
}
