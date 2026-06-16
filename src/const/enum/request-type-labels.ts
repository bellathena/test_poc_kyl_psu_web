import { RequestType } from "./request-type";

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.FIND_FULLTEXT_4U]: "Find Fulltext 4U",
  [RequestType.ITHENTICATE]: "iThenticate",
  [RequestType.BOOK_DELIVERY]: "Book Delivery",
  [RequestType.ILL]: "Interlibrary Loan",
  [RequestType.ACADEMIC_PUBLICATION_DISSEMINATION]: "เผยแพร่งานวิชาการ",
};

export const REQUEST_TYPE_COLORS: Record<RequestType, string> = {
  [RequestType.FIND_FULLTEXT_4U]: "blue",
  [RequestType.ITHENTICATE]: "orange",
  [RequestType.BOOK_DELIVERY]: "green",
  [RequestType.ILL]: "purple",
  [RequestType.ACADEMIC_PUBLICATION_DISSEMINATION]: "cyan",
};
