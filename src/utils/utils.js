export const evaluateFormula = (formula, grid) => {
    const regex = /([A-Z]+)(\d+)/g;
    const matches = [...formula.matchAll(regex)];
    let evaluatedFormula = formula;

    matches.forEach(match => {
        const col = match[1];
        const row = parseInt(match[2]) - 1;
        const colIndex = col.charCodeAt(0) - 65;
        evaluatedFormula = evaluatedFormula.replace(match[0], grid[row][colIndex].value || 0);
    });

    try {
        return eval(evaluatedFormula);
    } catch (error) {
        return undefined;
    }
};
