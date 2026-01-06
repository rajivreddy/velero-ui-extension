<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name: 'VeleroBackupRepositoryDetail',

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
    phase() {
      return this.value.status?.phase || 'Unknown';
    },

    phaseClass() {
      switch (this.phase) {
      case 'Ready':
        return 'status-ready';
      case 'NotReady':
        return 'status-warning';
      case 'Failed':
        return 'status-error';
      default:
        return 'status-info';
      }
    },

    backupStorageLocation() {
      return this.value.spec?.backupStorageLocation || '-';
    },

    repositoryType() {
      return this.value.spec?.repositoryType || '-';
    },

    volumeNamespace() {
      return this.value.spec?.volumeNamespace || '-';
    },

    resticIdentifier() {
      return this.value.spec?.resticIdentifier || '-';
    },

    maintenanceFrequency() {
      return this.value.spec?.maintenanceFrequency || '-';
    },

    lastMaintenanceTime() {
      const time = this.value.status?.lastMaintenanceTime;

      if (!time) {
        return '-';
      }

      return new Date(time).toLocaleString();
    },

    message() {
      return this.value.status?.message || '';
    },
  },
};
</script>

<template>
  <ResourceTabs
    :value="value"
    :mode="mode"
  >
    <Tab
      name="overview"
      label="Overview"
      :weight="100"
    >
      <div class="row mb-20">
        <div class="col span-12">
          <h3>Repository Status</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Status</h4>
          <span :class="['status-badge', phaseClass]">{{ phase }}</span>
        </div>

        <div class="detail-card">
          <h4>Repository Type</h4>
          <span>{{ repositoryType }}</span>
        </div>

        <div class="detail-card">
          <h4>Storage Location</h4>
          <span>{{ backupStorageLocation }}</span>
        </div>

        <div class="detail-card">
          <h4>Volume Namespace</h4>
          <span>{{ volumeNamespace }}</span>
        </div>
      </div>

      <div v-if="message" class="row mb-20 mt-20">
        <div class="col span-12">
          <div class="error-box">
            <strong>Message:</strong> {{ message }}
          </div>
        </div>
      </div>

      <div class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Maintenance</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Maintenance Frequency</h4>
          <span>{{ maintenanceFrequency }}</span>
        </div>

        <div class="detail-card">
          <h4>Last Maintenance</h4>
          <span>{{ lastMaintenanceTime }}</span>
        </div>
      </div>

      <div v-if="resticIdentifier !== '-'" class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Restic Configuration</h3>
        </div>
      </div>

      <div v-if="resticIdentifier !== '-'" class="detail-cards">
        <div class="detail-card wide">
          <h4>Restic Identifier</h4>
          <code>{{ resticIdentifier }}</code>
        </div>
      </div>
    </Tab>

    <Tab
      name="spec"
      label="Spec"
      :weight="90"
    >
      <div class="row mb-20">
        <div class="col span-12">
          <h3>Repository Specification</h3>
        </div>
      </div>

      <div class="spec-table">
        <table>
          <tbody>
            <tr>
              <td class="spec-key">Backup Storage Location</td>
              <td>{{ backupStorageLocation }}</td>
            </tr>
            <tr>
              <td class="spec-key">Repository Type</td>
              <td>{{ repositoryType }}</td>
            </tr>
            <tr>
              <td class="spec-key">Volume Namespace</td>
              <td>{{ volumeNamespace }}</td>
            </tr>
            <tr>
              <td class="spec-key">Maintenance Frequency</td>
              <td>{{ maintenanceFrequency }}</td>
            </tr>
            <tr v-if="resticIdentifier !== '-'">
              <td class="spec-key">Restic Identifier</td>
              <td><code>{{ resticIdentifier }}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Tab>
  </ResourceTabs>
</template>

<style lang="scss" scoped>
.detail-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.detail-card {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 15px;

  h4 {
    color: var(--muted);
    font-size: 12px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  span, code {
    font-size: 14px;
    font-weight: 500;
  }

  code {
    background: var(--body-bg);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    word-break: break-all;
  }

  &.wide {
    grid-column: span 2;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
}

.status-ready {
  background-color: var(--success);
  color: white;
}

.status-warning {
  background-color: var(--warning);
  color: white;
}

.status-error {
  background-color: var(--error);
  color: white;
}

.status-info {
  background-color: var(--info);
  color: white;
}

.error-box {
  background-color: var(--error-bg, rgba(220, 53, 69, 0.1));
  border: 1px solid var(--error-border, rgba(220, 53, 69, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--error-text, var(--body-text));
}

.spec-table {
  table {
    width: 100%;
    border-collapse: collapse;

    td {
      padding: 10px 15px;
      border-bottom: 1px solid var(--border);
    }

    .spec-key {
      font-weight: 500;
      width: 250px;
      color: var(--muted);
    }

    code {
      background: var(--input-bg);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }
  }
}
</style>
