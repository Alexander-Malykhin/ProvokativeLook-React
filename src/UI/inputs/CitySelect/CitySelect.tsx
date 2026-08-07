//styles
import styles from './CitySelect.module.scss';

export interface CityOptionInterface {
    value: string;
    label: string;
    coordinates: [number, number];
}

interface CitySelectProps {
    value: string;
    options: CityOptionInterface[];
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

const CitySelect = ({
    value,
    options,
    onChange,
    label = 'Доставка в',
    className = '',
}: CitySelectProps) => {
    return (
        <label className={`${styles.select} ${className}`.trim()}>
            {label && (
                <span className={styles.select__label}>{label}</span>
            )}

            <select
                className={styles.select__field}
                value={value}
                onChange={event => onChange(event.target.value)}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default CitySelect;
