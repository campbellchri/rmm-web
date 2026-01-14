import ApiService from './ApiService'

export type LegalDocument = {
    id: string
    type: string
    content: string
    effectiveDate: string
    createdAt: string
    updatedAt: string
}

export async function apiGetLegalDocument(type: string) {
    return ApiService.fetchDataWithAxios<LegalDocument | LegalDocument[]>({
        url: `/legal-documents/type/${type}`,
        method: 'get',
    })
}
