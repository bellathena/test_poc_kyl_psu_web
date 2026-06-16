export const RequestType = {
    FIND_FULLTEXT_4U : "FIND_FULLTEXT_4U",
    ITHENTICATE : "ITHENTICATE",
    BOOK_DELIVERY: "BOOK_DELIVERY",
    ILL: "ILL",
    ACADEMIC_PUBLICATION_DISSEMINATION: "ACADEMIC_PUBLICATION_DISSEMINATION",
} as const;

export type RequestType = (typeof RequestType)[keyof typeof RequestType];