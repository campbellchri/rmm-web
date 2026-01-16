import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { useNavigate } from 'react-router-dom'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    name: string
    password: string
    email: string
}

const validationSchema: ZodType<SignUpFormSchema> = z.object({
    email: z.string({ required_error: 'Please enter your email' }),
    name: z.string({ required_error: 'Please enter your name' }),
    password: z.string({ required_error: 'Password Required' }),
    // confirmPassword: z.string({
    //     required_error: 'Confirm Password Required',
    // }),
})
/* .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    }) */

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        const { name, password, email } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signUp({ name, password, email })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                navigate('/sign-in')
            }
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form
                onSubmit={handleSubmit(onSignUp)}
                className="flex flex-col gap-4"
            >
                {/* User name */}
                <FormItem
                    label="User name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="User Name"
                                autoComplete="off"
                                className="!bg-[#383C56] !text-white"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Email */}
                <FormItem
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
                                className="!bg-[#383C56] !text-white"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Password */}
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                autoComplete="off"
                                placeholder="Password"
                                className="!bg-[#383C56] !text-white"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Confirm Password */}
                {/* <FormItem
                    label="Confirm Password"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Confirm Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem> */}

                {/* Submit Button */}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    className="mt-2 font-poppins !text-base md:text-[20px]"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
