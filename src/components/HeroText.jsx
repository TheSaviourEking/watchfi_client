import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router";

const HeroText = ({ classname, reference, header, text, cta: { variant, ctaText, href } }) => {
    return (
        <div className={cn("text-white", classname)}>
            <h1 className="text-heading">
                {header}
            </h1>
            {
                reference && (
                    <p className="px0 my-4">Ref:{' ' + reference}</p>
                )
            }

            {
                text && (
                    // <p className="subText mt-4">{text}</p>
                    <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{text}</p>
                )
            }
            {/* <div className="flex gap-4"> */}
            {/* <Link to={href}>
                    <Button className="mt-8" variant={variant || 'default'}>
                        {ctaText}
                    </Button>
                </Link> */}

            <Link to={href}>
                <Button className="mt-8" variant={variant || 'default'}>
                    {ctaText}
                </Button>
            </Link>
            {/* </div> */}
        </div>
    )
}

export default HeroText;