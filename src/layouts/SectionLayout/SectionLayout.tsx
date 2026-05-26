//types
import type {SectionLayoutInterface} from "@layouts/SectionLayout/types.ts";

const SectionLayout = ({children, className}: SectionLayoutInterface) => {
    return (
        <section className={className}>
            {children}
        </section>
    );
};

export default SectionLayout;