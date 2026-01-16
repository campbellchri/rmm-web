import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormItem } from '@/components/ui/Form'
import { Input, InputProps } from '@/components/ui/Input'
import PasswordInput from './PasswordInput'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface CommonInputProps<TFieldValues extends FieldValues> extends Omit<InputProps, 'name'> {
    name: Path<TFieldValues>
    control: Control<TFieldValues>
    label?: string
    errorMessage?: string
    invalid?: boolean
    containerClassName?: string
    labelClassName?: string
    floatingLabel?: boolean
    value?: any
}

const CommonInput = <TFieldValues extends FieldValues>(
    props: CommonInputProps<TFieldValues>,
) => {
    const {
        name,
        control,
        label,
        errorMessage,
        invalid,
        containerClassName,
        labelClassName,
        type,
        className,
        floatingLabel,
        value: propValue,
        ...rest
    } = props

    const [isFocused, setIsFocused] = useState(false)

    return (
        <FormItem
            label={!floatingLabel ? label : ''}
            invalid={invalid}
            errorMessage={errorMessage}
            className={containerClassName}
            labelClass={labelClassName}
        >
            <Controller
                name={name}
                control={control}
                render={({ field: { ref: fieldRef, ...field } }) => {
                    const hasValue = field.value !== undefined && field.value !== null && field.value !== ''
                    const isFloating = floatingLabel && (isFocused || hasValue)

                    const inputElement = type === 'password' ? (
                        <PasswordInput
                            {...field}
                            {...rest}
                            ref={fieldRef as any}
                            placeholder={propValue || rest.placeholder}
                            className={className || `!bg-[#383C56] !text-white border border-[#454a64] ${floatingLabel ? 'pt-6 pb-2' : ''}`}
                            onFocus={(e) => {
                                setIsFocused(true)
                                rest.onFocus?.(e as any)
                            }}
                            onBlur={(e) => {
                                setIsFocused(false)
                                rest.onBlur?.(e as any)
                            }}
                        />
                    ) : (
                        <Input
                            {...field}
                            {...rest}
                            ref={fieldRef as any}
                            type={type}
                            placeholder={propValue || rest.placeholder}
                            className={className || `!bg-[#383C56] !text-white border border-[#454a64] ${floatingLabel ? 'pt-6 pb-2' : ''}`}
                            onFocus={(e) => {
                                setIsFocused(true)
                                rest.onFocus?.(e as any)
                            }}
                            onBlur={(e) => {
                                setIsFocused(false)
                                rest.onBlur?.(e as any)
                            }}
                        />
                    )

                    if (floatingLabel) {
                        return (
                            <div className="relative">
                                {inputElement}
                                <label
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none font-poppins ${isFloating
                                        ? 'top-1 text-xs text-[#A1A1AA]'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-[#A1A1AA]'
                                        }`}
                                >
                                    {label}
                                </label>
                            </div>
                        )
                    }

                    return inputElement
                }}
            />
        </FormItem>
    )
}

export default CommonInput
