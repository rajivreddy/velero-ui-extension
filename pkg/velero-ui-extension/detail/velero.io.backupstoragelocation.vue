<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name:       'VeleroBackupStorageLocationDetail',
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
      case 'Available':
        return 'bg-success';
      case 'Unavailable':
        return 'bg-error';
      default:
        return 'bg-muted';
      }
    },

    providerName() {
      const provider = this.value.spec?.provider;

      const providers = {
        aws:       'AWS S3',
        azure:     'Azure Blob Storage',
        gcp:       'Google Cloud Storage',
      };

      return providers[provider] || provider || 'Unknown';
    },

    accessModeLabel() {
      const mode = this.value.spec?.accessMode;

      return mode === 'ReadOnly' ? 'Read Only' : 'Read/Write';
    },

    configEntries() {
      return Object.entries(this.value.spec?.config || {}).filter(([k, v]) => v);
    },

    hasCredential() {
      return !!this.value.spec?.credential?.name;
    },

    lastValidationTime() {
      return this.value.status?.lastValidationTime || '-';
    },

    lastSyncedTime() {
      return this.value.status?.lastSyncedTime || '-';
    },

    lastSyncedRevision() {
      return this.value.status?.lastSyncedRevision || '-';
    },

    accessError() {
      return this.value.status?.message || '';
    },
  },
};
</script>

<template>
  <ResourceTabs :value="value" mode="view">
    <!-- Status Tab -->
    <Tab name="status" label="Status" :weight="100">
      <div v-if="accessError" class="error-box mb-20">
        <strong>Access Error:</strong> {{ accessError }}
      </div>

      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Location Status</h4>
            <div class="status-row">
              <span class="status-label">Phase:</span>
              <span class="status-badge" :class="statusColor">{{ statusPhase }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Default:</span>
              <span>{{ value.spec?.default ? 'Yes' : 'No' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Access Mode:</span>
              <span>{{ accessModeLabel }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Sync Status</h4>
            <div class="status-row">
              <span class="status-label">Last Validation:</span>
              <span>{{ lastValidationTime }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Last Synced:</span>
              <span>{{ lastSyncedTime }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Last Synced Revision:</span>
              <span>{{ lastSyncedRevision }}</span>
            </div>
          </div>
        </div>
      </div>
    </Tab>

    <!-- Configuration Tab -->
    <Tab name="configuration" label="Configuration" :weight="90">
      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Provider</h4>
            <div class="status-row">
              <span class="status-label">Provider:</span>
              <span>{{ providerName }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Backup Sync Period:</span>
              <span>{{ value.spec?.backupSyncPeriod || 'Default' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Validation Frequency:</span>
              <span>{{ value.spec?.validationFrequency || 'Default' }}</span>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Object Storage</h4>
            <div class="status-row">
              <span class="status-label">Bucket:</span>
              <span>{{ value.spec?.objectStorage?.bucket || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Prefix:</span>
              <span>{{ value.spec?.objectStorage?.prefix || '-' }}</span>
            </div>
            <div class="status-row">
              <span class="status-label">Has CA Cert:</span>
              <span>{{ value.spec?.objectStorage?.caCert ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Credentials</h4>
            <div v-if="hasCredential">
              <div class="status-row">
                <span class="status-label">Secret Name:</span>
                <span>{{ value.spec?.credential?.name }}</span>
              </div>
              <div class="status-row">
                <span class="status-label">Secret Key:</span>
                <span>{{ value.spec?.credential?.key }}</span>
              </div>
            </div>
            <div v-else>
              <p class="text-muted">Using default Velero server credentials</p>
            </div>
          </div>
        </div>
        <div class="col span-6">
          <div class="detail-card">
            <h4>Provider Configuration</h4>
            <div v-if="configEntries.length">
              <div
                v-for="[key, val] in configEntries"
                :key="key"
                class="status-row"
              >
                <span class="status-label">{{ key }}:</span>
                <span>{{ val }}</span>
              </div>
            </div>
            <div v-else>
              <p class="text-muted">No additional configuration</p>
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

.bg-muted {
  background-color: var(--muted);
}

.text-muted {
  color: var(--muted);
  font-style: italic;
}

.error-box {
  background-color: var(--error-bg, rgba(220, 53, 69, 0.1));
  border: 1px solid var(--error-border, rgba(220, 53, 69, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--error-text, var(--body-text));
}
</style>
