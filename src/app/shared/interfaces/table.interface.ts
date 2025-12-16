export interface TableColumn {
	field: string;
	header: string;
	sortable?: boolean;
	width?: string;
	styleClass?: string;
	type?: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'template';
	templateRef?: string; // Key to identify custom template in the consuming component
}

export interface TablePageEvent {
	first: number;
	rows: number;
	page: number;
	pageCount: number;
}

export interface TableSortEvent {
	field: string;
	order: 1 | -1;
}
