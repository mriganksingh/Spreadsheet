import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './Spreadsheet.css';
import {evaluateFormula} from "../utils/utils";

const Spreadsheet = () => {
    const defaultRows = 10;
    const defaultCols = 10;

    const [grid, setGrid] = useState(() => {
        const savedGrid = localStorage.getItem('grid');
        if (savedGrid) {
            return JSON.parse(savedGrid);
        } else {
            return Array(defaultRows).fill().map(() =>
                Array(defaultCols).fill({ value: '', styles: {} })
            );
        }
    });

    const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        localStorage.setItem('grid', JSON.stringify(grid));
    }, [grid]);

    const handleCellEdit = (row, col, value, styles, evaluate = false) => {
        const newGrid = [...grid];
        newGrid[row][col] = { value, styles };
        setGrid(newGrid);
        setUndoStack([...undoStack, grid]);
        setRedoStack([]);

        if (evaluate) {
            evaluateFormulaInCell(row, col);
        }
    };

    const addRow = () => {
        const newGrid = [...grid, Array(grid[0].length).fill({ value: '', styles: {} })];
        setGrid(newGrid);
        setUndoStack([...undoStack, grid]);
        setRedoStack([]);
    };

    const addColumn = () => {
        const newGrid = grid.map(row => [...row, { value: '', styles: {} }]);
        setGrid(newGrid);
        setUndoStack([...undoStack, grid]);
        setRedoStack([]);
    };

    const handleUndo = () => {
        const previousState = undoStack.pop();
        if (previousState) {
            setRedoStack([grid, ...redoStack]);
            setGrid(previousState);
        }
    };

    const handleRedo = () => {
        const nextState = redoStack.shift();
        if (nextState) {
            setUndoStack([grid, ...undoStack]);
            setGrid(nextState);
        }
    };

    const handleCellFocus = (row, col) => {
        setActiveCell({ row, col });
    };

    const handleFormatChange = (style, value) => {
        const { row, col } = activeCell;
        const newStyles = { ...grid[row][col].styles, [style]: value };
        handleCellEdit(row, col, grid[row][col].value, newStyles);
    };

    const getColumnLabel = (index) => {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    };

    const evaluateFormulaInCell = (row, col) => {
        const cell = grid[row][col];
        const cellValue = cell?.value || '';
        if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
            const formula = cellValue.slice(1);
            const result = evaluateFormula(formula, grid);
            if (result !== undefined) {
                handleCellEdit(row, col, result, cell.styles);
            }
        }
    };

    return (
        <div className="spreadsheet">
            <div className="toolbar">
                <button onClick={() => handleFormatChange('bold', !grid[activeCell.row][activeCell.col].styles.bold)}>B</button>
                <button onClick={() => handleFormatChange('italic', !grid[activeCell.row][activeCell.col].styles.italic)}>I</button>
                <button onClick={() => handleFormatChange('align', 'left')}>Left</button>
                <button onClick={() => handleFormatChange('align', 'center')}>Center</button>
                <button onClick={() => handleFormatChange('align', 'right')}>Right</button>
            </div>
            <div className="controls">
                <button onClick={addRow}>Add Row</button>
                <button onClick={addColumn}>Add Column</button>
                <button onClick={handleUndo}>Undo</button>
                <button onClick={handleRedo}>Redo</button>
            </div>
            <table className="grid">
                <thead>
                <tr>
                    <th></th>
                    {Array.from({ length: grid[0].length }).map((_, colIndex) => (
                        <th key={colIndex}>{getColumnLabel(colIndex)}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {grid.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <th>{rowIndex + 1}</th>
                        {row.map((cell, colIndex) => (
                            <Cell
                                key={colIndex}
                                row={rowIndex}
                                col={colIndex}
                                value={cell.value}
                                styles={cell.styles}
                                active={activeCell.row === rowIndex && activeCell.col === colIndex}
                                onEdit={handleCellEdit}
                                onFocus={handleCellFocus}
                            />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Spreadsheet;
