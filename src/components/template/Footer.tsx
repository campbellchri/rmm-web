import { Link } from 'react-router-dom'
import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="flex items-center justify-between flex-auto w-full">
            <span>
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span> All
                rights reserved.
            </span>
            <div className="flex gap-4">
                <Link className="text-gray" to="/?scroll=home">
                    Home
                </Link>
                <span className="text-muted"> | </span>
                <Link className="text-gray" to="/sign-in">
                    Create Memorial
                </Link>
                <span className="text-muted"> | </span>
                <Link className="text-gray" to="/?scroll=how-it-works">
                    How It Works
                </Link>
                <span className="text-muted"> | </span>
                <Link className="text-gray" to="/?scroll=faq">
                    FAQ
                </Link>
                <span className="text-muted"> | </span>
                <Link className="text-gray" to="/terms-and-conditions">
                    Term & Conditions
                </Link>
                <span className="text-muted"> | </span>
                <Link className="text-gray" to="/privacy-policy">
                    Privacy & Policy
                </Link>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
