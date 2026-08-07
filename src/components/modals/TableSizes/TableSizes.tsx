import Modal from "@UI/overlays/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { closeTableSizes } from "@store/slices/toggleModalTableSizesSlice";
import styles from "./TableSizes.module.scss";
import { TABLE_SIZE_ROWS } from "./data";

const TableSizes = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.toggleModalTableSizes.isModalTableSizesOpen,
  );
  const close = () => dispatch(closeTableSizes());

  return (
    <Modal
      open={isOpen}
      onClose={close}
      overlayClassName={styles.modals}
      contentClassName={styles.modals__table}
      ariaLabelledBy="table-sizes-title"
    >
      <div className={styles.modals__header}>
        <h2 id="table-sizes-title" className={styles.modals__header_title}>
          Таблица размеров
        </h2>
        <button
          type="button"
          aria-label="Закрыть таблицу размеров"
          className={styles.modals__close}
          onClick={close}
        >
          <span className={styles.modals__close_line} />
          <span className={styles.modals__close_line} />
        </button>
      </div>

      <div className={styles.modals__content}>
        <table className={styles.modals__sizes}>
          <tbody className={styles.modals__sizes_body}>
            {TABLE_SIZE_ROWS.map((row, rowIndex) => (
              <tr key={row[0]} className={styles.modals__sizes_row}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={`${styles.modals__sizes_cell} ${
                      cellIndex === 0 ? styles.modals__sizes_cell_name : ""
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
    </Modal>
  );
};

export default TableSizes;
