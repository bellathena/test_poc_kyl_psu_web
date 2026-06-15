import { RequestType } from "./request-type";

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.FIND_FULLTEXT_4U]: "Find Fulltext 4U",
  [RequestType.ITHENTICATE]: "iThenticate",
  [RequestType.BOOK_DELIVERY]: "Book Delivery",
};

export const REQUEST_TYPE_COLORS: Record<RequestType, string> = {
  [RequestType.FIND_FULLTEXT_4U]: "blue",
  [RequestType.ITHENTICATE]: "orange",
  [RequestType.BOOK_DELIVERY]: "green",
};
