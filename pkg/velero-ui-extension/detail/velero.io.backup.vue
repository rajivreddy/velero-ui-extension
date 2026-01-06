<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';
import SortableTable from '@shell/components/SortableTable';
import { VELERO_TYPES } from '../product';

export default {
  name:       'VeleroBackupDetail',
  components: {
    ResourceTabs,
    Tab,
    SortableTable,
  },

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  computed: {
    statusPhase() {
      return this.value.status?.phase || 'Unknown';
    },

    statusColor() {
      const phase = this.statusPhase;

      switch (phase) {
      case 'Completed':
        return 'bg-success';
      case 'Failed':
      case 'PartiallyFailed':
        return 'bg-error';
      case 'InProgress':
      case 'New':
      case 'WaitingForPluginOperations':
      case 'WaitingForPluginOperationsPartiallyFailed':
        return 'bg-info';
      case 'Deleting':
        return 'bg-warning';
      default:
        return 'bg-muted';
      }
    },

    duration() {
      if (this.value.status?.startTimestamp && this.value.status?.completionTimestamp) {
        const start = new Date(this.value.status.startTimestamp);
        const end = new Date(this.value.status.completionTimestamp);
        const diff = Math.round((end - start) / 1000);

        if (diff < 60) {
          return `${diff}s`;
        }
        if (diff < 3600) {
          return `${Math.floor(diff / 60)}m ${diff % 60}s`;
        }

        return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
      }

      return '-';
    },

    itemsCounts() {
      const items = [];

      if (this.value.status?.progress) {
        items.push({
          label: 'Items Backed Up',
          value: `${this.value.status.progress.itemsBackedUp || 0} / ${this.value.status.progress.totalItems || 0}`,
        });
      }

      return items;
    },

    warnings() {
      return this.value.status?.warnings || 0;
    },

    errors() {
      return this.value.status?.errors || 0;
    },

    failureReason() {
      return this.value.status?.failureReason || '';
    },

    validationErrors() {
      return this.value.status?.validationErrors || [];
    },

    includedNamespaces() {
      return this.value.spec?.includedNamespaces?.length
        ? this.value.spec.includedNamespaces.join(', ')
        : 'All';
    },

    excludedNamespaces() {
      return this.value.spec?.excludedNamespaces?.length
        ? this.value.spec.excludedNamespaces.join(', ')
        : 'None';
    },

    includedResources() {
      return this.value.spec?.includedResources?.length
        ? this.value.spec.includedResources.join(', ')
        : 'All';
    },

    excludedResources() {
      return this.value.spec?.excludedResources?.length
        ? this.value.spec.excludedResources.join(', ')
        : 'None';
    },

    labelSelector() {
      if (this.value.spec?.labelSelector?.matchLabels) {
        return Object.entries(this.value.spec.labelSelector.matchLabels)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
      }

      return 'None';
    },

    volumeSnapshotHeaders() {
      return [
        { name: 'name', label: 'Volume', value: 'name' },
        { name: 'snapshotDataName', label: 'Snapshot', value: 'snapshotDataName' },
      ];
    },

    volumeSnapshots() {
      return this.value.status?.volumeSnapshotsAttempted || 0;
    },

    volumeSnapshotsCompleted() {
      return this.value.status?.volumeSnapshotsCompleted || 0;
    },
  },
};
</script>

<template>
  <ResourceTabs :value="value" mode="view">
    <!-- Status Tab -->
    <Tab name="status" label="Status" :weight="100">
      <div v-if="failureReason" class="error-box mb-20">
        <strong>Failure Reason:</strong> {{ failureReason }}
      </div>

      <div
        v-for="(err, idx) in validationErrors"
        :key="idx"
        class="error-box mb-10"
      >
        <strong>Validation Error:</strong> {{ err }}
      </div>

      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Backup Status</h4>
            <div class="status-row">
              <span class="status-label">Phase:</span>
              <span class="status-badge" :class="statusColor">{{ statusPhase }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Started:</span>
              <span>{{ value.status?.startTimestamp || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Completed:</span>
              <span>{{ value.status?.completionTimestamp || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Duration:</span>
              <span>{{ duration }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Expiration:</span>
              <span>{{ value.status?.expiration || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Backup Results</h4>
            <div class="status-row">
              <span class="status-label">Warnings:</span>
              <span :class="{ 'text-warning': warnings > 0 }">{{ warnings }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Errors:</span>
              <span :class="{ 'text-error': errors > 0 }">{{ errors }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Volume Snapshots:</span>
              <span>{{ volumeSnapshotsCompleted }} / {{ volumeSnapshots }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Format Version:</span>
              <span>{{ value.status?.formatVersion || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="value.status?.progress" class="row mb-20">
        <div class="col span-12">
          <div class="detail-card">
            <h4>Progress</h4>
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                :style="{
                  width: `${(value.status.progress.itemsBackedUp / value.status.progress.totalItems) * 100}%`
                }"
              />
            </div>
            <p class="progress-text">
              {{ value.status.progress.itemsBackedUp }} / {{ value.status.progress.totalItems }} items backed up
            </p>
          </div>
        </div>
      </div>
    </Tab>

    <!-- Configuration Tab -->
    <Tab name="configuration" label="Configuration" :weight="90">
      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Storage</h4>
            <div class="status-row">
              <span class="status-label">Storage Location:</span>
              <span>{{ value.spec?.storageLocation || 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">TTL:</span>
              <span>{{ value.spec?.ttl || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Volume Snapshot Locations:</span>
              <span>{{ value.spec?.volumeSnapshotLocations?.join(', ') || 'Default' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Volume Options</h4>
            <div class="status-row">
              <span class="status-label">Snapshot Volumes:</span>
              <span>{{ value.spec?.snapshotVolumes === true ? 'Yes' : value.spec?.snapshotVolumes === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Snapshot Move Data:</span>
              <span>{{ value.spec?.snapshotMoveData === true ? 'Yes' : value.spec?.snapshotMoveData === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Default Volumes to FS Backup:</span>
              <span>{{ value.spec?.defaultVolumesToFsBackup === true ? 'Yes' : value.spec?.defaultVolumesToFsBackup === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Data Mover:</span>
              <span>{{ value.spec?.datamover || 'Default' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Namespace Selection</h4>
            <div class="status-row">
              <span class="status-label">Included:</span>
              <span>{{ includedNamespaces }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Excluded:</span>
              <span>{{ excludedNamespaces }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Resource Selection</h4>
            <div class="status-row">
              <span class="status-label">Included:</span>
              <span>{{ includedResources }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Excluded:</span>
              <span>{{ excludedResources }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Include Cluster Resources:</span>
              <span>{{ value.spec?.includeClusterResources === true ? 'Yes' : value.spec?.includeClusterResources === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Label Selector:</span>
              <span>{{ labelSelector }}</span>
            </div>
          </div>
        </div>
      </div>
    </Tab>
  </ResourceTabs>
</template>

<style lang="scss" scoped>
.detail-card {
  background: var(--body-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 15px;
  height: 100%;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
}

.status-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
}

.status-label {
  font-weight: 500;
  color: var(--muted);
}

.status-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.bg-success {
  background-color: var(--success);
}

.bg-error {
  background-color: var(--error);
}

.bg-info {
  background-color: var(--info);
}

.bg-warning {
  background-color: var(--warning);
}

.bg-muted {
  background-color: var(--muted);
}

.text-warning {
  color: var(--warning);
  font-weight: 500;
}

.text-error {
  color: var(--error);
  font-weight: 500;
}

.progress-bar-container {
  background: var(--input-bg);
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
}

.progress-bar {
  background: var(--primary);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 5px;
  font-size: 13px;
  color: var(--muted);
}

.error-box {
  background-color: var(--error-bg, rgba(220, 53, 69, 0.1));
  border: 1px solid var(--error-border, rgba(220, 53, 69, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--error-text, var(--body-text));
}
</style>
