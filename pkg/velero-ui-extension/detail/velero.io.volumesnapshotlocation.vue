<script>
import ResourceTabs from '@shell/components/form/ResourceTabs';
import Tab from '@shell/components/Tabbed/Tab';

export default {
  name:       'VeleroVolumeSnapshotLocationDetail',
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
    providerName() {
      const provider = this.value.spec?.provider;

      const providers = {
        aws:       'AWS EBS',
        azure:     'Azure Disk',
        gcp:       'Google Compute Engine',
        vsphere:   'vSphere',
        csi:       'CSI',
        openstack: 'OpenStack Cinder',
      };

      return providers[provider] || provider || 'Unknown';
    },

    configEntries() {
      return Object.entries(this.value.spec?.config || {}).filter(([k, v]) => v);
    },

    hasCredential() {
      return !!this.value.spec?.credential?.name;
    },
  },
};
</script>

<template>
  <ResourceTabs :value="value" mode="view">
    <!-- Configuration Tab -->
    <Tab name="configuration" label="Configuration" :weight="100">
      <div class="row mb-20">
        <div class="col span-6">
          <div class="detail-card">
            <h4>Provider</h4>
            <div class="status-row">
              <span class="status-label">Provider:</span>
              <span>{{ providerName }}</span>
            </div>
          </div>
        </div>
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
      </div>

      <div class="row mb-20">
        <div class="col span-12">
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

.text-muted {
  color: var(--muted);
  font-style: italic;
}
</style>
