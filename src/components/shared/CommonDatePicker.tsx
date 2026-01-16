import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormItem } from '@/components/ui/Form'
import DatePicker, { DatePickerProps } from '@/components/ui/DatePicker/DatePicker'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface CommonDatePickerProps<TFieldValues extends FieldValues>
    extends Omit<DatePickerProps, 'name' | 'onChange' | 'value'> {
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

const CommonDatePicker = <TFieldValues extends FieldValues>(
    props: CommonDatePickerProps<TFieldValues>,
) => {
    const {
        name,
        control,
        label,
        errorMessage,
        invalid,
        containerClassName,
        labelClassName,
        placeholder,
        className,
        floatingLabel,
        inputFormat = 'YYYY-MM-DD',
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
                render={({ field }) => {
                    const hasValue = field.value !== undefined && field.value !== null && field.value !== ''
                    const isFloating = floatingLabel && (isFocused || hasValue)

                    const datePickerElement = (
                        <DatePicker
                            {...rest}
                            placeholder={propValue || placeholder}
                            className={className || `text-white bg-[#383C56] border border-[#454a64] rounded-md ${floatingLabel ? 'pt-6 pb-2' : ''}`}
                            value={field.value}
                            onChange={field.onChange}
                            inputFormat={inputFormat}
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
                                {datePickerElement}
                                <label
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none font-poppins z-10 ${isFloating
                                        ? 'top-1 text-xs text-[#A1A1AA]'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-[#A1A1AA]'
                                        }`}
                                >
                                    {label}
                                </label>
                            </div>
                        )
                    }

                    return datePickerElement
                }}
            />
        </FormItem>
    )
}

export default CommonDatePicker
