//types
import type {SectionLayoutInterface} from "@layouts/SectionLayout/types.ts";

const SectionLayout = ({children, className, id}: SectionLayoutInterface) => {
    return (
        <section className={className} id={id}>
            {children}
        </section>
    );
};

export default SectionLayout;