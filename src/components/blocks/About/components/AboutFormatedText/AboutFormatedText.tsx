import type {ReactNode} from "react";
//types
import type {AboutFormattedTextInterface} from "@components/blocks/About/components/AboutFormatedText/types.ts";


const AboutFormatedText = ({text = '', className, paragraphClassName, accentClassName,}: AboutFormattedTextInterface) => {

    const renderInline = (value: string): ReactNode[] => {
        return value.split(/(\[b\].*?\[\/b\])/g).map((part, index) => {
            const boldMatch = part.match(/\[b\](.*?)\[\/b\]/);

            if (boldMatch) {
                return (
                    <span key={index} className={accentClassName}>
                        <strong>{boldMatch[1]}</strong>
                    </span>
                );
            }

            return part;
        });
    };

    return (
        <div className={className}>
            {text.split('[br]').map((paragraph, index) => (
                <p key={index} className={paragraphClassName}>
                    {renderInline(paragraph)}
                </p>
            ))}
        </div>
    );
};

export default AboutFormatedText;