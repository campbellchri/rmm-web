import { useState } from 'react'
import { Input, InputProps } from '@/components/ui/Input'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import type { MouseEvent, Ref } from 'react'

interface PasswordInputProps extends InputProps {
    onVisibleChange?: (visible: boolean) => void
    ref?: Ref<HTMLInputElement>
}

const PasswordInput = (props: PasswordInputProps) => {
    const { onVisibleChange, ref, className, ...rest } = props

    const [pwInputType, setPwInputType] = useState('password')

    const onPasswordVisibleClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        const nextValue = pwInputType === 'password' ? 'text' : 'password'
        setPwInputType(nextValue)
        onVisibleChange?.(nextValue === 'text')
    }

    return (
        <Input
            {...rest}
            ref={ref}
            type={pwInputType}
            className={className}
            suffix={
                <span
                    className="cursor-pointer select-none text-xl "
                    role="button"
                    onClick={onPasswordVisibleClick}
                >
                    {pwInputType === 'password' ? (
                        <HiOutlineEyeOff />
                    ) : (
                        <HiOutlineEye />
                    )}
                </span>
            }
        />
    )
}

export default PasswordInput
