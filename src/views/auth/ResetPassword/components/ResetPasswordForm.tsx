import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { apiResetPassword } from '@/services/AuthService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { CommonInput } from '@/components/shared'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Alert from '@/components/ui/Alert'

interface ResetPasswordFormProps extends CommonProps {
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    newPassword: string
    confirmPassword: string
}

const validationSchema: ZodType<ResetPasswordFormSchema> = z
    .object({
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)
    const [searchParams] = useSearchParams()

    const { className, signInUrl = '/sign-in' } = props
    const navigate = useNavigate()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onResetPassword = async (values: ResetPasswordFormSchema) => {
        const { newPassword, confirmPassword } = values

        const token = searchParams.get('token')

        if (!token) {
            setMessage('Invalid reset link. Token is missing.')
            return
        }

        setSubmitting(true)
        setMessage(null)

        try {
            const resp = await apiResetPassword({
                token,
                newPassword,
                confirmPassword
            })
            if (resp) {
                setSubmitting(false)
                navigate(signInUrl)
            }
        } catch (errors) {
            setMessage(
                typeof errors === 'string' ? errors : ''
            )
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setMessage('Invalid or missing token in the URL.')
        }
    }, [searchParams])

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <Form onSubmit={handleSubmit(onResetPassword)}>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.newPassword)}
                    errorMessage={errors.newPassword?.message}
                    labelClass="text-white"
                >
                    <CommonInput
                        name="newPassword"
                        control={control}
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                    />
                </FormItem>
                <FormItem
                    label="Confirm Password"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                    labelClass="text-white"
                >
                    <CommonInput
                        name="confirmPassword"
                        control={control}
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                    />
                </FormItem>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    className="
                            mt-6
                            bg-[linear-gradient(96.23deg,#ECA024_5.01%,#F9C94F_50.03%,#EAA32A_95.05%)]
                            rounded-full
                            font-poppins
                            font-medium
                            text-[20px]
                            leading-none
                            tracking-normal       
                            text-center
                            align-middle
                            text-black
                            "
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </Form>
        </div>
    )
}

export default ResetPasswordForm
