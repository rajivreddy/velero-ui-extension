<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import KeyValue from '@shell/components/form/KeyValue';

const PROVIDER_OPTIONS = [
  { label: 'AWS EBS', value: 'aws' },
  { label: 'Azure Disk', value: 'azure' },
  { label: 'Google Compute Engine', value: 'gcp' },
  { label: 'vSphere', value: 'vsphere' },
  { label: 'CSI', value: 'csi' },
  { label: 'OpenStack Cinder', value: 'openstack' },
];

export default {
  name:       'VeleroVolumeSnapshotLocationEdit',
  components: {
    CruResource,
    NameNsDescription,
    LabeledInput,
    LabeledSelect,
    Tab,
    Tabbed,
    KeyValue,
  },
  mixins: [CreateEditView],

  props: {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: 'edit',
    },
  },

  async fetch() {
    // Fetch secrets for credential selection
    try {
      this.secrets = await this.$store.dispatch('cluster/findAll', { type: 'secret' });
    } catch (e) {
      this.secrets = [];
    }
  },

  data() {
    if (!this.value.spec) {
      this.value.spec = {
        provider:   '',
        credential: null,
        config:     {},
      };
    }

    // Ensure config exists
    if (!this.value.spec.config) {
      this.value.spec.config = {};
    }

    return {
      secrets:          [],
      providerOptions:  PROVIDER_OPTIONS,
    };
  },

  computed: {
    secretOptions() {
      return this.secrets
        .filter((s) => s.metadata?.namespace === this.value.metadata?.namespace)
        .map((secret) => ({
          label: secret.metadata?.name,
          value: secret.metadata?.name,
        }));
    },

    isAws() {
      return this.value.spec.provider === 'aws';
    },

    isAzure() {
      return this.value.spec.provider === 'azure';
    },

    isGcp() {
      return this.value.spec.provider === 'gcp';
    },

    isVsphere() {
      return this.value.spec.provider === 'vsphere';
    },

    isView() {
      return this.mode === 'view';
    },
  },

  watch: {
    'value.spec.provider'(newVal, oldVal) {
      // Reset config when provider changes
      if (newVal !== oldVal) {
        this.value.spec.config = {};
      }
    },
  },

  methods: {
    updateConfig(val) {
      this.value.spec.config = val;
    },
    setCredential(name, key) {
      if (name && key) {
        this.value.spec.credential = {
          name,
          key,
        };
      } else {
        this.value.spec.credential = null;
      }
    },
  },
};
</script>

<template>
  <CruResource
    :done-route="doneRoute"
    :mode="mode"
    :resource="value"
    :errors="errors"
    @error="(e) => (errors = e)"
    @finish="save"
    @cancel="done"
  >
    <NameNsDescription
      :value="value"
      :mode="mode"
      :namespaced="true"
    />

    <Tabbed :side-tabs="true">
      <!-- Provider Tab -->
      <Tab name="provider" label="Provider" :weight="100">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Volume Snapshot Provider</h3>
            <p class="text-muted">
              Configure the cloud provider for taking volume snapshots.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.provider"
              :mode="mode"
              :options="providerOptions"
              label="Provider"
              required
            />
          </div>
        </div>

        <div class="info-box mb-20">
          Volume snapshot locations work with cloud provider-native volume snapshot APIs.
          Make sure your cloud provider credentials have permissions to create and manage snapshots.
        </div>
      </Tab>

      <!-- Credentials Tab -->
      <Tab name="credentials" label="Credentials" :weight="90">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Credential Configuration</h3>
            <p class="text-muted">
              Configure credentials for accessing the snapshot provider.
              Leave empty to use the default credentials from the Velero server configuration.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              :value="value.spec.credential?.name"
              :mode="mode"
              :options="secretOptions"
              option-label="label"
              :searchable="true"
              :clearable="true"
              label="Secret Name"
              @input="(val) => setCredential(val, value.spec.credential?.key || 'cloud')"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              :value="value.spec.credential?.key"
              :mode="mode"
              label="Secret Key"
              tooltip="The key within the secret containing the credentials file"
              placeholder="cloud"
              @input="(val) => setCredential(value.spec.credential?.name, val)"
            />
          </div>
        </div>
      </Tab>

      <!-- Provider Config Tab -->
      <Tab name="config" label="Provider Config" :weight="80">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Provider-Specific Configuration</h3>
          </div>
        </div>

        <!-- AWS Config -->
        <template v-if="isAws">
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.region"
                :mode="mode"
                label="Region"
                tooltip="AWS region for EBS snapshots"
                placeholder="us-east-1"
                required
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.profile"
                :mode="mode"
                label="AWS Profile"
                tooltip="AWS profile name to use from credentials file"
                placeholder="default"
              />
            </div>
          </div>
        </template>

        <!-- Azure Config -->
        <template v-if="isAzure">
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.apiTimeout"
                :mode="mode"
                label="API Timeout"
                tooltip="Timeout for Azure API calls"
                placeholder="2m0s"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.resourceGroup"
                :mode="mode"
                label="Resource Group"
                tooltip="Azure resource group for snapshots (defaults to same as cluster)"
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.subscriptionId"
                :mode="mode"
                label="Subscription ID"
                tooltip="Azure subscription ID (defaults to same as cluster)"
              />
            </div>
            <div class="col span-6">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="value.spec.config.incremental === 'true'"
                  :disabled="mode === 'view'"
                  @change="(e) => $set(value.spec.config, 'incremental', e.target.checked ? 'true' : 'false')"
                />
                <span>Use Incremental Snapshots</span>
              </label>
              <p class="text-muted">Use Azure incremental snapshots (cost-effective)</p>
            </div>
          </div>
        </template>

        <!-- GCP Config -->
        <template v-if="isGcp">
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.project"
                :mode="mode"
                label="Project ID"
                tooltip="GCP project ID for snapshots"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.snapshotLocation"
                :mode="mode"
                label="Snapshot Location"
                tooltip="GCP region or multi-region for snapshot storage"
                placeholder="us"
              />
            </div>
          </div>
        </template>

        <template v-if="isVsphere">
          <div class="warning-box mb-20">
            vSphere volume snapshots require the Velero vSphere plugin to be installed.
          </div>
        </template>

        <!-- Additional Config -->
        <div class="row mb-20">
          <div class="col span-12">
            <h4>Additional Configuration</h4>
            <p class="text-muted">
              Add any additional provider-specific configuration key-value pairs.
            </p>
            <KeyValue
              :value="value.spec.config"
              :mode="mode"
              :add-label="'Add Config'"
              :read-allowed="false"
              @input="updateConfig"
            />
          </div>
        </div>
      </Tab>
    </Tabbed>
  </CruResource>
</template>

<style lang="scss" scoped>
.text-muted {
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 10px;
}

.info-box {
  background-color: var(--info-bg, rgba(0, 123, 255, 0.1));
  border: 1px solid var(--info-border, rgba(0, 123, 255, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--info-text, var(--body-text));
}

.warning-box {
  background-color: var(--warning-bg, rgba(255, 193, 7, 0.1));
  border: 1px solid var(--warning-border, rgba(255, 193, 7, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--warning-text, var(--body-text));
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
