import { useRef, useState, useEffect, ChangeEvent } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import Notification from '../Notification/Notification'
import toast from '../toast/toast'

interface SingleImageUploadProps {
    accept?: string
    beforeUpload?: (file: File) => boolean | string
    disabled?: boolean
    onChange?: (file: File | null) => void
    onFileRemove?: () => void
    defaultFile?: any
    uploading?: boolean
    recommendedSize?: string
}

const SingleImageUpload = ({
    accept = 'image/*',
    beforeUpload,
    disabled = false,
    onChange,
    onFileRemove,
    defaultFile,
    uploading = false,
    recommendedSize = '1200 x 800px',
}: SingleImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | any | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    // Initialize default file
    useEffect(() => {
        if (defaultFile) {
            setFile(defaultFile)
            // If it's an existing file with fileURL, use that
            if (defaultFile.fileURL) {
                setPreview(defaultFile.fileURL)
            } else if (defaultFile instanceof File) {
                setPreview(URL.createObjectURL(defaultFile))
            }
        } else {
            setFile(null)
            setPreview(null)
        }
    }, [defaultFile])

    const triggerMessage = (msg: string = 'Upload Failed!') => {
        toast.push(
            <Notification type="danger" duration={2000}>
                {msg}
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const onNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0]

        if (!newFile) return

        let result: boolean | string = true

        if (beforeUpload) {
            result = beforeUpload(newFile)

            if (result === false) {
                triggerMessage()
                return
            }
            if (typeof result === 'string' && result.length > 0) {
                triggerMessage(result)
                return
            }
        }

        if (result) {
            setFile(newFile)
            setPreview(URL.createObjectURL(newFile))
            onChange?.(newFile)
        }

        // Reset input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile(null)
        setPreview(null)
        onFileRemove?.()

        // Reset input value
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const triggerUpload = () => {
        if (!disabled && !uploading) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div
            onClick={triggerUpload}
            className="w-full h-[240px] border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer hover:border-[#C7A30D] transition"
        >
            <input
                ref={fileInputRef}
                type="file"
                disabled={disabled || uploading}
                accept={accept}
                hidden
                onChange={onNewFileUpload}
            />

            {uploading ? (
                <div className="flex flex-col items-center text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-3"></div>
                    <p className="text-white text-sm">Uploading...</p>
                </div>
            ) : preview ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded"
                    />
                    <button
                        onClick={removeFile}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center">
                    <div className="bg-[#383c56] p-3 rounded-full mb-3">
                        <ImageIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <p className="text-white text-sm">
                        Drag & drop image here or{' '}
                        <span className="text-yellow-600 font-medium text-sm">
                            Browse files
                        </span>
                    </p>
                    <p className="text-sm text-white mt-1">
                        Recommended size: {recommendedSize}
                    </p>
                </div>
            )}
        </div>
    )
}

export default SingleImageUpload