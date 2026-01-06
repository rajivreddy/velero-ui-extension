<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name: 'VeleroPodVolumeRestoreDetail',

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
      case 'Completed':
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

    restoreName() {
      return this.value.metadata?.labels?.['velero.io/restore-name'] || '-';
    },

    podName() {
      return this.value.spec?.pod?.name || '-';
    },

    podNamespace() {
      return this.value.spec?.pod?.namespace || '-';
    },

    volume() {
      return this.value.spec?.volume || '-';
    },

    uploaderType() {
      return this.value.spec?.uploaderType || 'restic';
    },

    snapshotID() {
      return this.value.spec?.snapshotID || '-';
    },

    backupStorageLocation() {
      return this.value.spec?.backupStorageLocation || '-';
    },

    progress() {
      const progress = this.value.status?.progress;

      if (!progress) {
        return null;
      }

      return {
        bytesDone:  progress.bytesDone || 0,
        totalBytes: progress.totalBytes || 0,
      };
    },

    progressPercentage() {
      if (!this.progress || !this.progress.totalBytes) {
        return 0;
      }

      return Math.round((this.progress.bytesDone / this.progress.totalBytes) * 100);
    },

    startTimestamp() {
      const time = this.value.status?.startTimestamp;

      if (!time) {
        return '-';
      }

      return new Date(time).toLocaleString();
    },

    completionTimestamp() {
      const time = this.value.status?.completionTimestamp;

      if (!time) {
        return '-';
      }

      return new Date(time).toLocaleString();
    },

    message() {
      return this.value.status?.message || '';
    },

    nodeName() {
      return this.value.spec?.node || '-';
    },
  },

  methods: {
    formatBytes(bytes) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${ parseFloat((bytes / Math.pow(k, i)).toFixed(2)) } ${ sizes[i] }`;
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
          <h3>Pod Volume Restore Status</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Status</h4>
          <span :class="['status-badge', phaseClass]">{{ phase }}</span>
        </div>

        <div class="detail-card">
          <h4>Restore Name</h4>
          <span>{{ restoreName }}</span>
        </div>

        <div class="detail-card">
          <h4>Pod</h4>
          <span>{{ podNamespace }}/{{ podName }}</span>
        </div>

        <div class="detail-card">
          <h4>Volume</h4>
          <span>{{ volume }}</span>
        </div>
      </div>

      <div v-if="progress && phase === 'InProgress'" class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Progress</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercentage + '%' }"
              />
            </div>
            <p class="progress-text">
              {{ formatBytes(progress.bytesDone) }} / {{ formatBytes(progress.totalBytes) }} ({{ progressPercentage }}%)
            </p>
          </div>
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
          <h3>Timing</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Started</h4>
          <span>{{ startTimestamp }}</span>
        </div>

        <div class="detail-card">
          <h4>Completed</h4>
          <span>{{ completionTimestamp }}</span>
        </div>
      </div>

      <div class="row mb-20 mt-20">
        <div class="col span-12">
          <h3>Configuration</h3>
        </div>
      </div>

      <div class="detail-cards">
        <div class="detail-card">
          <h4>Uploader Type</h4>
          <span>{{ uploaderType }}</span>
        </div>

        <div class="detail-card">
          <h4>Node</h4>
          <span>{{ nodeName }}</span>
        </div>

        <div class="detail-card">
          <h4>Storage Location</h4>
          <span>{{ backupStorageLocation }}</span>
        </div>

        <div v-if="snapshotID !== '-'" class="detail-card wide">
          <h4>Snapshot ID</h4>
          <code>{{ snapshotID }}</code>
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

.error-box {
  background-color: var(--error-bg, rgba(220, 53, 69, 0.1));
  border: 1px solid var(--error-border, rgba(220, 53, 69, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--error-text, var(--body-text));
}

.progress-container {
  margin-top: 10px;
}

.progress-bar {
  height: 20px;
  background-color: var(--input-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 5px;
  font-size: 13px;
  color: var(--muted);
}
</style>
