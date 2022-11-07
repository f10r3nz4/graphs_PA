export interface LinkI {
    from: String,
    to: String,
    weight: number,
}

export interface GraphI {
    oriented: boolean | undefined,
    links: LinkI[]
}

export interface LinkISQL {
    node_from: String, 
    node_to: String,
    weight: number,
    graph_id: number,
    id: String
}

