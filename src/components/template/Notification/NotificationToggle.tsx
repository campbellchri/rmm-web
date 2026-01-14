import classNames from '@/utils/classNames'
import Badge from '@/components/ui/Badge'

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    const icon = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15 6.66602C15 5.2853 14.5118 4.10679 13.5355 3.13048C12.5592 2.15417 11.3807 1.66602 10 1.66602C8.61929 1.66602 7.44078 2.15417 6.46447 3.13048C5.48816 4.10679 5 5.2853 5 6.66602C5 12.4993 2.5 14.166 2.5 14.166H17.5C17.5 14.166 15 12.4993 15 6.66602Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinejoin="round"
            />
            <path
                d="M11.4419 17.5C11.1208 18.0536 10.6402 18.3304 10.0003 18.3304C9.36028 18.3304 8.87972 18.0536 8.55859 17.5"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>{icon}</Badge>
            ) : (
                icon
            )}
        </div>
    )
}

export default NotificationToggle
