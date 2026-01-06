<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name:       'VeleroRestoreDetail',
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
        : 'All from backup';
    },

    excludedNamespaces() {
      return this.value.spec?.excludedNamespaces?.length
        ? this.value.spec.excludedNamespaces.join(', ')
        : 'None';
    },

    includedResources() {
      return this.value.spec?.includedResources?.length
        ? this.value.spec.includedResources.join(', ')
        : 'All from backup';
    },

    excludedResources() {
      return this.value.spec?.excludedResources?.length
        ? this.value.spec.excludedResources.join(', ')
        : 'None';
    },

    namespaceMapping() {
      if (this.value.spec?.namespaceMapping) {
        return Object.entries(this.value.spec.namespaceMapping)
          .map(([source, target]) => `${source} → ${target}`)
          .join(', ');
      }

      return 'None';
    },

    labelSelector() {
      if (this.value.spec?.labelSelector?.matchLabels) {
        return Object.entries(this.value.spec.labelSelector.matchLabels)
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
            <h4>Restore Status</h4>
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
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Restore Results</h4>
            <div class="status-row">
              <span class="status-label">Warnings:</span>
              <span :class="{ 'text-warning': warnings > 0 }">{{ warnings }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Errors:</span>
              <span :class="{ 'text-error': errors > 0 }">{{ errors }}</span>
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
                  width: `${(value.status.progress.itemsRestored / value.status.progress.totalItems) * 100}%`
                }"
              />
            </div>
            <p class="progress-text">
              {{ value.status.progress.itemsRestored }} / {{ value.status.progress.totalItems }} items restored
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
            <h4>Source</h4>
            <div class="status-row">
              <span class="status-label">Backup Name:</span>
              <span>{{ value.spec?.backupName || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Schedule Name:</span>
              <span>{{ value.spec?.scheduleName || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Options</h4>
            <div class="status-row">
              <span class="status-label">Restore PVs:</span>
              <span>{{ value.spec?.restorePVs === true ? 'Yes' : value.spec?.restorePVs === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Preserve Node Ports:</span>
              <span>{{ value.spec?.preserveNodePorts === true ? 'Yes' : value.spec?.preserveNodePorts === false ? 'No' : 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Existing Resource Policy:</span>
              <span>{{ value.spec?.existingResourcePolicy || 'None (skip)' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Include Cluster Resources:</span>
              <span>{{ value.spec?.includeClusterResources === true ? 'Yes' : value.spec?.includeClusterResources === false ? 'No' : 'Default' }}</span>
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
            <div class="status-row">
              <span class="status-label">Namespace Mapping:</span>
              <span>{{ namespaceMapping }}</span>
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
