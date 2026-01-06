<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name:       'VeleroScheduleDetail',
  components: {
    ResourceTabs,
    Tab,
  },

  props: {
    value: {
      type:     Object,
      required: true,
    },
  },

  computed: {
    statusPhase() {
      if (this.value.spec?.paused) {
        return 'Paused';
      }

      return this.value.status?.phase || 'Unknown';
    },

    statusColor() {
      if (this.value.spec?.paused) {
        return 'bg-warning';
      }

      const phase = this.value.status?.phase;

      switch (phase) {
      case 'Enabled':
        return 'bg-success';
      case 'FailedValidation':
        return 'bg-error';
      default:
        return 'bg-muted';
      }
    },

    cronDescription() {
      const cron = this.value.spec?.schedule;

      if (!cron) {
        return 'Not set';
      }

      // Common cron patterns
      const patterns = {
        '0 * * * *':    'Every hour',
        '0 */6 * * *':  'Every 6 hours',
        '0 */12 * * *': 'Every 12 hours',
        '0 0 * * *':    'Daily at midnight',
        '0 2 * * *':    'Daily at 2 AM',
        '0 0 * * 0':    'Weekly on Sunday at midnight',
        '0 0 1 * *':    'Monthly on the 1st at midnight',
      };

      return patterns[cron] || cron;
    },

    lastBackup() {
      return this.value.status?.lastBackup || '-';
    },

    lastSkipped() {
      return this.value.status?.lastSkipped || '-';
    },

    validationErrors() {
      return this.value.status?.validationErrors || [];
    },

    includedNamespaces() {
      return this.value.spec?.template?.includedNamespaces?.length
        ? this.value.spec.template.includedNamespaces.join(', ')
        : 'All';
    },

    excludedNamespaces() {
      return this.value.spec?.template?.excludedNamespaces?.length
        ? this.value.spec.template.excludedNamespaces.join(', ')
        : 'None';
    },

    includedResources() {
      return this.value.spec?.template?.includedResources?.length
        ? this.value.spec.template.includedResources.join(', ')
        : 'All';
    },

    excludedResources() {
      return this.value.spec?.template?.excludedResources?.length
        ? this.value.spec.template.excludedResources.join(', ')
        : 'None';
    },

    labelSelector() {
      if (this.value.spec?.template?.labelSelector?.matchLabels) {
        return Object.entries(this.value.spec.template.labelSelector.matchLabels)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
      }

      return 'None';
    },
  },
};
</script>

<template>
  <ResourceTabs :value="value" mode="view">
    <!-- Status Tab -->
    <Tab name="status" label="Status" :weight="100">
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
            <h4>Schedule Status</h4>
            <div class="status-row">
              <span class="status-label">Phase:</span>
              <span class="status-badge" :class="statusColor">{{ statusPhase }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Schedule:</span>
              <span class="cron-value">{{ value.spec?.schedule || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Description:</span>
              <span>{{ cronDescription }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Paused:</span>
              <span>{{ value.spec?.paused ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Backup History</h4>
            <div class="status-row">
              <span class="status-label">Last Backup:</span>
              <span>{{ lastBackup }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Last Skipped:</span>
              <span>{{ lastSkipped }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Skip Immediately:</span>
              <span>{{ value.spec?.skipImmediately ? 'Yes' : 'No' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Use Owner References:</span>
              <span>{{ value.spec?.useOwnerReferencesInBackup ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
    </Tab>

    <!-- Backup Template Tab -->
    <Tab name="template" label="Backup Template" :weight="90">
      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Storage Configuration</h4>
            <div class="status-row">
              <span class="status-label">Storage Location:</span>
              <span>{{ value.spec?.template?.storageLocation || 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">TTL:</span>
              <span>{{ value.spec?.template?.ttl || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Volume Snapshot Locations:</span>
              <span>{{ value.spec?.template?.volumeSnapshotLocations?.join(', ') || 'Default' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Volume Options</h4>
            <div class="status-row">
              <span class="status-label">Snapshot Volumes:</span>
              <span>{{ value.spec?.template?.snapshotVolumes === true ? 'Yes' : value.spec?.template?.snapshotVolumes === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Snapshot Move Data:</span>
              <span>{{ value.spec?.template?.snapshotMoveData === true ? 'Yes' : value.spec?.template?.snapshotMoveData === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Default Volumes to FS Backup:</span>
              <span>{{ value.spec?.template?.defaultVolumesToFsBackup === true ? 'Yes' : value.spec?.template?.defaultVolumesToFsBackup === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Data Mover:</span>
              <span>{{ value.spec?.template?.datamover || 'Default' }}</span>
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
              <span>{{ value.spec?.template?.includeClusterResources === true ? 'Yes' : value.spec?.template?.includeClusterResources === false ? 'No' : 'Default' }}</span>
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

.cron-value {
  font-family: monospace;
  background: var(--input-bg);
  padding: 2px 8px;
  border-radius: 4px;
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

.error-box {
  background-color: var(--error-bg, rgba(220, 53, 69, 0.1));
  border: 1px solid var(--error-border, rgba(220, 53, 69, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--error-text, var(--body-text));
}
</style>
