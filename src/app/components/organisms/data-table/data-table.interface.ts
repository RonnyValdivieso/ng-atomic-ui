/**
 * Column descriptor for the redesigned `app-data-table` organism.
 *
 * `type` selects a built-in cell renderer so common cells (entity name with
 * avatar, status pill, row actions) are styled once in the organism:
 * - `name`   — avatar (initials of `field`) + title (`field`) + optional `sub` line.
 * - `status` — ACTIVE/INACTIVE pill from `field`.
 * - `text`   — plain text from `value(row)` or `row[field]`; em-dash when empty.
 * - `actions`— view + (disabled) more buttons; view emits `rowClick`.
 * - `template` — caller-provided cell via `*appDataCell="field"`.
 */
export interface DataTableColumn<T = unknown> {
  field: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
  type?: 'name' | 'status' | 'text' | 'actions' | 'template';
  /** For `type: 'name'` — secondary (monospace) line, usually the id. */
  sub?: string;
  /** Custom text accessor for `type: 'text'` (e.g. nested fields). */
  value?: (row: T) => string | null | undefined;
}
