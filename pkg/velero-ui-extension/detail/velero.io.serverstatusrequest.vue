<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name: 'VeleroServerStatusRequestDetail',

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
      case 'Processed':
        return 'status-success';
      case 'InProgress':
        return 'status-info';
      case 'Failed':
        return 'status-error';
      case 'New':
        return 'status-warning';
      default:
        return 'status-info';
      }
    },

    serverStatus() {
      return this.value.status?.serverStatus || {};
    },

    serverVersion() {
      return this.serverStatus.version || '-';
    },

    plugins() {
      return this.value.status?.plugins || [];
    },

    processedTimestamp() {
      const time = this.value.status?.processedTimestamp;

      if (!time) {
        return '-';
      }

      return new Date(time).toLocaleString();
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
          <h3>Server Status Request</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Status</h4>
          <span :class="['status-badge', phaseClass]">{{ phase }}</span>
        </div>

        <div class="detail-card">
          <h4>Server Version</h4>
          <span>{{ serverVersion }}</span>
        </div>

        <div class="detail-card">
          <h4>Processed</h4>
          <span>{{ processedTimestamp }}</span>
        </div>
      </div>

      <div v-if="plugins.length > 0" class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Plugins</h3>
        </div>
      </div>

      <div v-if="plugins.length > 0" class="plugins-list">
        <div
          v-for="(plugin, index) in plugins"
          :key="index"
          class="plugin-card"
        >
          <h4>{{ plugin.name || 'Unknown Plugin' }}</h4>
          <p v-if="plugin.kind">
            <strong>Kind:</strong> {{ plugin.kind }}
          </p>
        </div>
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

  span {
    font-size: 14px;
    font-weight: 500;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
}

.status-success {
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

.plugins-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.plugin-card {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 15px;

  h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
  }

  p {
    margin: 5px 0;
    font-size: 13px;
    color: var(--muted);
  }
}
</style>
