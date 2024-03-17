export interface BaseRelation {
    partner?: BaseNode
    isMarried?: boolean
    children: BaseNode[]
}

export interface BaseNode {
    id: string | number
    name: string
    image?: string
    generation?: number
    relationships: BaseRelation[]
}
