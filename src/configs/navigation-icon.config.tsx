import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'
import { FileImage, FileText, HelpCircle } from 'lucide-react'
import { TbFileSettings } from 'react-icons/tb'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <PiHouseLineDuotone />,
    photoVideos: <FileImage />,
    memories: <FileText />,
    generalsettings: <TbFileSettings />,
    helpSupport: <HelpCircle />,
}

export default navigationIcon
