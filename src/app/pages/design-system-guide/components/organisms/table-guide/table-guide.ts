import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import usersData from './users-data.json';
import { TableComponent } from '@organisms/table';
import { TableColumn } from '@shared/interfaces/table.interface';

@Component({
	selector: 'app-table-guide',
	standalone: true,
	imports: [CommonModule, TableComponent],
	templateUrl: './table-guide.html',
	styleUrls: ['./table-guide.css'],
})
export class TableGuideComponent {
	readonly rowsPerPageOptions = signal<number[]>([10, 20, 50, 100]);
	readonly defaultRowsPerPage = signal<number>(10);
	readonly columns = signal<TableColumn[]>([
		{ field: 'id', header: 'ID', width: '10%', sortable: true },
		{ field: 'name', header: 'Name', width: '30%', sortable: true },
		{ field: 'role', header: 'Role', width: '20%', sortable: true },
		{ field: 'status', header: 'Status', width: '20%', type: 'template', templateRef: 'status' },
		{ field: 'lastLogin', header: 'Last Login', width: '20%', type: 'date' },
	]);

	readonly users = signal<any[]>(
		usersData.map(user => ({
			...user,
			lastLogin: new Date(user.lastLogin)
		}))
	);

	readonly loading = signal<boolean>(false);

	getStatusSeverity(status: string): string {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'Inactive':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	handlePage(event: any) {
		console.log('Page event:', event);
	}

	handleSort(event: any) {
		console.log('Sort event:', event);
	}

	handleRowClick(data: any) {
		console.log('Row clicked:', data);
	}
}
