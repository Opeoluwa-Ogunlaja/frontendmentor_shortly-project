export const hasClass = (elem, className) => elem.classList.contains(className)

export const exchangeClassName = (elem, className1, className2) => {
    if (hasClass(elem, className1) && hasClass(elem, className2)) return;
    if (!hasClass(elem, className1) && !hasClass(elem, className2)) return;

    if (hasClass(elem, className1)) {
        elem.className = elem.className.replace(className1, className2)

        return true
    }
    if (hasClass(elem, className2)) {
        elem.className = elem.className.replace(className2, className1)

        return true
    }
}