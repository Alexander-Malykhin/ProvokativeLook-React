import {Fragment} from "react";

export const convertAliasTitle = (title: string) => {
    return title.split('#br#').map((item, index, array) => (
        <Fragment key={index}>
            {item}
            {index < array.length - 1 && <br/>}
        </Fragment>)
    )
}