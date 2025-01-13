import React from 'react';
import './Cell.css';

const Cell = ({ row, col, value, styles = {}, active, onFocus, onEdit }) => {
    const handleChange = (e) => {
        onEdit(row, col, e.target.value, styles);
    };

    const handleBlur = () => {
        onEdit(row, col, value, styles, true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    return (
        <td
            className={`cell ${active ? 'active' : ''}`}
            onClick={() => onFocus(row, col)}
        >
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="cell-input"
                style={{
                    textAlign: styles.align || 'left',
                    fontWeight: styles.bold ? 'bold' : 'normal',
                    fontStyle: styles.italic ? 'italic' : 'normal',
                }}
            />
        </td>
    );
};

export default Cell;
