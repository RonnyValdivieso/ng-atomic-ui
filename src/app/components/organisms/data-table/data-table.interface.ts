/**
 * Column descriptor for the redesigned `app-data-table` organism.
 *
 * `type` selects a built-in cell renderer so common cells (entity name with
 * avatar, status pill, row actions) are styled once in the organism:
 * - `name`   — avatar (initials of `field`) + title (`field`).
 * - `status` — ACTIVE/INACTIVE pill from `field`.
 * - `text`   — plain text from `value(row)` or `row[field]`; em-dash when empty.
 * - `actions`— copy-id + view + (disabled) more buttons; view emits `rowClick`.
 * - `template` — caller-provided cell via `*appDataCell="field"`.
 */
export interface DataTableColumn<T = unknown> {
  field: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
  type?: 'name' | 'status' | 'text' | 'actions' | 'template';
  /** Custom text accessor for `type: 'text'` (e.g. nested fields). */
  value?: (row: T) => string | null | undefined;
  /**
   * Only honored by `type: 'name'`. When set and the row has a truthy value at
   * this field (typically a picture URL), the avatar renders an `<img>` instead
   * of initials.
   */
  pictureField?: string;
}
