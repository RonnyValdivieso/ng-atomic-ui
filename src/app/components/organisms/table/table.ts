import {
	Component,
	ContentChildren,
	input,
	output,
	QueryList,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import {
	TableColumn,
	TablePageEvent,
	TableSortEvent,
} from '../../../shared/interfaces/table.interface';

/**
 * Reusable Table component based on PrimeNG Table
 * @example
 * <app-table
 *   [data]="users"
 *   [columns]="cols"
 *   [totalRecords]="100"
 *   [loading]="isLoading"
 *   (onPage)="loadUsers($event)">
 * </app-table>
 */
@Component({
	selector: 'app-table',
	standalone: true,
	imports: [CommonModule, TableModule],
	templateUrl: './table.html',
	styleUrls: ['./table.css'],
})
export class TableComponent {
	@ViewChild('dt') dt!: Table;
	@ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

	// Data & Config
	readonly data = input<any[]>([]);
	readonly columns = input<TableColumn[]>([]);
	readonly loading = input<boolean>(false);

	// Pagination
	readonly paginator = input<boolean>(true);
	readonly rows = input<number>(10);
	readonly totalRecords = input<number>(0);
	readonly rowsPerPageOptions = input<number[]>([10, 25, 50]);
	readonly showCurrentPageReport = input<boolean>(true);
	readonly currentPageReportTemplate = input<string>(
		'Showing {first} to {last} of {totalRecords} entries'
	);

	// Selection & Interaction
	readonly selectionMode = input<'single' | 'multiple' | null>(null);
	readonly dataKey = input<string>('id');
	readonly rowHover = input<boolean>(true);

	// Events
	readonly page = output<TablePageEvent>();
	readonly sort = output<TableSortEvent>();
	readonly rowSelect = output<any>();
	readonly rowUnselect = output<any>();

	// Template helpers
	getTemplate(type: string): TemplateRef<any> | null {
		const template = this.templates.find((t) => t.getType() === type);
		return template ? template.template : null;
	}

	protected onPageChange(event: any): void {
		this.page.emit(event);
	}

	protected onSortChange(event: any): void {
		this.sort.emit(event);
	}

	protected onRowSelect(event: any): void {
		this.rowSelect.emit(event.data);
	}

	protected onRowUnselect(event: any): void {
		this.rowUnselect.emit(event.data);
	}
}
