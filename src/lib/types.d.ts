export type PaginatedResponse<T> = {
    docs: T[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    page: number;
    pagingCounter: number;
    prevPage: number | null;
    totalDocs: number;
    totalPages: number;
  };

  export type Subcategory = {
    id: string;
    name: string;
    slug: string;
    parent: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    subcategories: {
      docs: Subcategory[]; // Recursive type
    };
  };

  
  export type Category = {
    id: string;
    name: string;
    slug: string;
    color?: string;
    parent?: string | Category | null;
    createdAt: string;
    updatedAt: string;
    subcategories: {
      docs: Category[];
      hasNextPage?: boolean;
      totalDocs?: number;
    };
  };
  