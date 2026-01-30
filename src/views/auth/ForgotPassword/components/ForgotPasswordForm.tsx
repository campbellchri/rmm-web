import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { apiForgotPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { CommonInput } from '@/components/shared'

interface ForgotPasswordFormProps extends CommonProps {
    emailSent: boolean
    setEmailSent?: (compplete: boolean) => void
    setMessage?: (message: string) => void
    onEmailSent?: (email: string) => void
}

type ForgotPasswordFormSchema = {
    email: string
}

const validationSchema: ZodType<ForgotPasswordFormSchema> = z.object({
    email: z.string().email().min(5),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { className, setMessage, setEmailSent, emailSent, children } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        const { email } = values

        try {
            const resp = await apiForgotPassword<boolean>({ email })
            if (resp) {
                setSubmitting(false)
                setEmailSent?.(true)
                props.onEmailSent?.(email)
            }
        } catch (errors) {
            setMessage?.(
                typeof errors === 'string' ? errors : '',
            )
            setSubmitting(false)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)}>
                    {/* <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem> */}
                    <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <CommonInput
                            name="email"
                            control={control}
                            type="email"
                            placeholder="Example@email.com"
                            autoComplete="off"
                        />
                    </FormItem>

                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                        className="
                            bg-[linear-gradient(96.23deg,#ECA024_5.01%,#F9C94F_50.03%,#EAA32A_95.05%)]
                            rounded-full
                            font-poppins
                            font-medium
                            text-[20px]
                            leading-none
                            tracking-normal       
                            text-center
                            align-middle
                            "

                    >
                        {isSubmitting ? 'Submiting...' : 'Send Reset Link'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ForgotPasswordForm
