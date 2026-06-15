export type RequestTable<T> = {
    page: number;
    limit: number;
    criteria: T;
}