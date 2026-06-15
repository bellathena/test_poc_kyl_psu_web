export const RequestType = {
    FIND_FULLTEXT_4U : "FIND_FULLTEXT_4U",
    ITHENTICATE : "ITHENTICATE",
    BOOK_DELIVERY: "BOOK_DELIVERY"
}

export type RequestType = (typeof RequestType)[keyof typeof RequestType];