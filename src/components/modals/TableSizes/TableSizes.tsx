import { useDispatch, useSelector } from 'react-redux';

import styles from './TableSizes.module.scss';
import { toggleModalTableSizes } from '@store/slices/toggleModalTableSizesSlice.ts';
import type { RootState } from '@store/store';

const tableRows = [
    ['Российский размер', '40', '42', '44', '46', '48', '50', '52', '54', '56'],
    ['Международный размер', 'XS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXL', '3XL'],
    ['Обхват груди, в см', '80-84', '84-88', '88-92', '92-96', '96-100', '100-104', '104-108', '108-112', '112-116'],
    ['Обхват талии, в см', '60-64', '64-68', '68-72', '72-76', '76-80', '80-84', '84-88', '88-92', '92-96'],
    ['Рост, см', '', '', '', '', '167-170', '', '', '', ''],
];

const TableSizes = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.toggleModalTableSizes.isModalTableSizesOpen);

    if (!isOpen) return null;

    return (
        <div className={styles.modals} onClick={() => dispatch(toggleModalTableSizes())}>
            <div className={styles.modals__table} onClick={(event) => event.stopPropagation()}>
                <div className={styles.modals__header}>
                    <h2 className={styles.modals__header_title}>Таблица размеров</h2>

                    <button
                        type="button"
                        className={styles.modals__close}
                        onClick={() => dispatch(toggleModalTableSizes())}
                    >
                        <span className={styles.modals__close_line}></span>
                        <span className={styles.modals__close_line}></span>
                    </button>
                </div>

                <div className={styles.modals__content}>
                    <table className={styles.modals__sizes}>
                        <tbody className={styles.modals__sizes_body}>
                        {tableRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={styles.modals__sizes_row}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={`${rowIndex}-${cellIndex}`}
                                        className={`${styles.modals__sizes_cell} ${
                                            cellIndex === 0 ? styles.modals__sizes_cell_name : ''
                                        }`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableSizes;