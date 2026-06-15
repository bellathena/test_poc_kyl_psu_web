export type ResponseTable<T> = {
    data : T[];
    pagination : {
        total_count: number;
        total_page: number;
    }
}