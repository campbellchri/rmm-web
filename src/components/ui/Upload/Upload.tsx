import {
    useRef,
    useState,
    useCallback,
    useEffect,
    ChangeEvent,
    MouseEvent,
} from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import classNames from '../utils/classNames'
import cloneDeep from 'lodash/cloneDeep'
import FileItem from './FileItem'
import CloseButton from '../CloseButton'
import Notification from '../Notification/Notification'
import toast from '../toast/toast'
import { BiPlus } from 'react-icons/bi'

interface UploadProps {
    accept?: string
    beforeUpload?: (file: FileList | null, fileList: (File | any)[]) => boolean | string
    disabled?: boolean
    multiple?: boolean
    onChange?: (files: (File | any)[], fileList: (File | any)[]) => void
    onFileRemove?: (files: (File | any)[]) => void
    uploadLimit?: number
    defaultFiles?: any[]
    uploading?: boolean
    isPlusIconVisible?: boolean
}

const filesToArray = (files: File[]) =>
    Object.keys(files).map((key) => files[key as any])

const Upload = ({
    accept,
    beforeUpload,
    disabled = false,
    multiple,
    onChange,
    onFileRemove,
    uploadLimit,
    defaultFiles = [],
    uploading = false,
    isPlusIconVisible = false
}: UploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<(File | any)[]>([])

    // initialize default files
    useEffect(() => {
        if (defaultFiles && defaultFiles.length > 0) {
            setFiles(defaultFiles)
        } else {
            setFiles([])
        }
    }, [defaultFiles])

    const triggerMessage = (msg: string = 'Upload Failed!') => {
        toast.push(
            <Notification type="danger" duration={2000}>
                {msg}
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const pushFile = (newFiles: FileList | null, file: File[]) => {
        if (newFiles) {
            for (const f of newFiles) {
                file.push(f)
            }
        }
        return file
    }

    const addNewFiles = (newFiles: FileList | null) => {
        let file = cloneDeep(files)

        if (typeof uploadLimit === 'number' && uploadLimit !== 0) {
            if (file.length >= uploadLimit) {
                if (uploadLimit === 1) {
                    file.shift() // replace the old one
                    file = pushFile(newFiles, file)
                }
                return file // ✅ return array directly
            }
        }

        file = pushFile(newFiles, file)
        return file // ✅ no need to wrap with filesToArray
    }

    const onNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files: newFiles } = e.target
        let result: boolean | string = true

        if (beforeUpload) {
            result = beforeUpload(newFiles, files)

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
            const updatedFiles = addNewFiles(newFiles)
            setFiles(updatedFiles)
            onChange?.(updatedFiles, files)
        }
    }

    const removeFile = (fileIndex: number) => {
        const updatedList = files.filter((_, i) => i !== fileIndex)
        setFiles(updatedList)
        onFileRemove?.(updatedList)
    }

    const triggerUpload = (e: MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
        e.stopPropagation()
    }

    return (
        <div
            onClick={triggerUpload}
            className="w-full h-[240px] relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer hover:border-[#C7A30D] transition"
        >
            <input
                ref={fileInputRef}
                type="file"
                disabled={disabled}
                multiple={multiple}
                accept={accept}
                hidden
                onChange={onNewFileUpload}
            />

            {uploading ? (
                <div className="flex flex-col items-center text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-3"></div>
                    <p className="text-white text-sm">Uploading...</p>
                </div>
            ) : files.length === 0 ? (
                <div className="flex flex-col items-center text-center">
                    <div className="bg-[#383c56] p-3 rounded-full mb-3">
                        <ImageIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <p className="text-white text-sm">
                        Drag & drop files here or{' '}
                        <span className="text-yellow-600 font-medium text-sm">
                            Browse files
                        </span>
                    </p>
                    <p className="text-sm text-white mt-1">
                        Recommended size: 1200 x 800px
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {files.map((file, index) => {
                        const isExisting = !(file instanceof File)
                        const fileURL = isExisting ? file.fileURL : URL.createObjectURL(file)
                        const mimeType = isExisting ? file.mimeType : file.type
                        const isImage = mimeType?.startsWith('image/')
                        const isVideo = mimeType?.startsWith('video/')

                        return (
                            <div
                                key={index}
                                className="relative border rounded-lg overflow-hidden group "
                            >
                                {isImage && (
                                    <img
                                        src={fileURL}
                                        alt={isExisting ? 'Existing media' : file.name}
                                        className="max-w-full max-h-40 object-cover mx-auto"
                                    />
                                )}

                                {isVideo && (
                                    <video
                                        src={fileURL}
                                        controls
                                        className="max-w-full max-h-40 object-cover mx-auto"
                                    />
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                    }}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

        {
            isPlusIconVisible && 
        <BiPlus className='text-[#C7A30D] absolute top-[10%] right-[2%]' size={40} />
        }
            
        </div>
    )
}

export default Upload
