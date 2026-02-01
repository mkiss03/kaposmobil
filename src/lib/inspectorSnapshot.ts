/**
 * Inspector Snapshot Store
 * Manages offline snapshot of valid parking cards
 */

export interface SnapshotRow {
  plate: string;
  zone: string;
  validUntil: number; // timestamp in ms
}

export type ValidationState = 'ACTIVE' | 'EXPIRED' | 'NOT_FOUND';

const SNAPSHOT_KEY = 'kaposvar_inspector_snapshot';

class InspectorSnapshot {
  /**
   * Get current snapshot from localStorage
   */
  static getSnapshot(): SnapshotRow[] {
    try {
      const stored = localStorage.getItem(SNAPSHOT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save snapshot to localStorage
   */
  static saveSnapshot(rows: SnapshotRow[]): void {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(rows));
  }

  /**
   * Generate demo snapshot with sample data
   * ABC-123: active (valid for 30 days)
   * ZZZ-999: expired (valid until yesterday)
   */
  static generateDemoSnapshot(): SnapshotRow[] {
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;
    const yesterday = now - 24 * 60 * 60 * 1000;

    const demo: SnapshotRow[] = [
      { plate: 'ABC-123', zone: 'Z1', validUntil: thirtyDaysFromNow },
      { plate: 'ZZZ-999', zone: 'Z2', validUntil: yesterday },
      { plate: 'XYZ-456', zone: 'Z3', validUntil: thirtyDaysFromNow },
    ];

    this.saveSnapshot(demo);
    return demo;
  }

  /**
   * Validate a plate against the snapshot
   * Returns: ACTIVE | EXPIRED | NOT_FOUND
   */
  static validate(plate: string): ValidationState {
    const snapshot = this.getSnapshot();
    const row = snapshot.find((r) => r.plate === plate);

    if (!row) {
      return 'NOT_FOUND';
    }

    const now = Date.now();
    if (row.validUntil > now) {
      return 'ACTIVE';
    }

    return 'EXPIRED';
  }

  /**
   * Get full record for a plate
   */
  static getRecord(plate: string): SnapshotRow | null {
    const snapshot = this.getSnapshot();
    return snapshot.find((r) => r.plate === plate) || null;
  }

  /**
   * Clear snapshot
   */
  static clear(): void {
    localStorage.removeItem(SNAPSHOT_KEY);
  }
}

export default InspectorSnapshot;
