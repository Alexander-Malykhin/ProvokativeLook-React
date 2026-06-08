import type { MouseEvent } from "react";
import type { AppDispatch } from "@store/store";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

// data
import { dataUserActions } from "./data.ts";

// store
import { add } from "@store/slices/toggleSearchSlice";
import { toggle } from "@store/slices/toggleMenuProfileSlice";

// styles
import styles from "./UserActions.module.scss";

// UI
import ActionButton from "@UI/buttons/ActionButton/ActionButton";
import Image from "@UI/buttons/Image/Image";

const UserActions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleClick = (
        event: MouseEvent<HTMLButtonElement>,
        item: (typeof dataUserActions)[number]
    ) => {
        event.stopPropagation();

        if ("path" in item) {
            navigate(item.path);
            return;
        }

        switch (item.action) {
            case "search":
                dispatch(add());
                break;

            case "profile":
                dispatch(toggle());
                break;

            default:
                break;
        }
    };

    return (
        <div className={styles.actions}>
            {dataUserActions.map((item) => (
                <ActionButton
                    key={item.id}
                    onClick={(event) => handleClick(event, item)}
                    className={styles.actions__button}
                >
                    <Image
                        src={item.image}
                        alt="action-icon"
                        className={styles.actions__image}
                    />
                </ActionButton>
            ))}
        </div>
    );
};

export default UserActions;