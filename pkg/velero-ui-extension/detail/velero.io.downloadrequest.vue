<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name: 'VeleroDownloadRequestDetail',

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

    target() {
      return this.value.spec?.target || {};
    },

    targetKind() {
      return this.target.kind || '-';
    },

    targetName() {
      return this.target.name || '-';
    },

    downloadURL() {
      return this.value.status?.downloadURL || '';
    },

    expiration() {
      const exp = this.value.status?.expiration;

      if (!exp) {
        return '-';
      }

      return new Date(exp).toLocaleString();
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
          <h3>Download Request Status</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Status</h4>
          <span :class="['status-badge', phaseClass]">{{ phase }}</span>
        </div>

        <div class="detail-card">
          <h4>Target Kind</h4>
          <span>{{ targetKind }}</span>
        </div>

        <div class="detail-card">
          <h4>Target Name</h4>
          <span>{{ targetName }}</span>
        </div>

        <div class="detail-card">
          <h4>Expiration</h4>
          <span>{{ expiration }}</span>
        </div>
      </div>

      <div v-if="downloadURL" class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Download URL</h3>
          <div class="info-box">
            <a
              :href="downloadURL"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ downloadURL }}
            </a>
          </div>
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

.info-box {
  background-color: var(--info-bg, rgba(0, 123, 255, 0.1));
  border: 1px solid var(--info-border, rgba(0, 123, 255, 0.3));
  border-radius: 4px;
  padding: 15px;
  word-break: break-all;

  a {
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
