<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import KeyValue from '@shell/components/form/KeyValue';
import SecretSelector from '@shell/components/form/SecretSelector';

const PROVIDER_OPTIONS = [
  { label: 'AWS S3 / MinIO / S3-Compatible', value: 'aws' },
  { label: 'Azure Blob Storage', value: 'azure' },
  { label: 'Google Cloud Storage', value: 'gcp' },
];

const ACCESS_MODE_OPTIONS = [
  { label: 'Read/Write', value: 'ReadWrite' },
  { label: 'Read Only', value: 'ReadOnly' },
];

export default {
  name:       'VeleroBackupStorageLocationEdit',
  components: {
    CruResource,
    NameNsDescription,
    LabeledInput,
    LabeledSelect,
    Tab,
    Tabbed,
    KeyValue,
    SecretSelector,
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
        provider:       '',
        default:        false,
        accessMode:     'ReadWrite',
        backupSyncPeriod: '',
        validationFrequency: '',
        credential:     {
          name: '',
          key:  'cloud',
        },
        objectStorage:  {
          bucket: '',
          prefix: '',
          caCert: '',
        },
        config: {},
      };
    }

    // Ensure credential exists
    if (!this.value.spec.credential) {
      this.$set(this.value.spec, 'credential', {
        name: '',
        key:  'cloud',
      });
    }

    // Ensure objectStorage exists
    if (!this.value.spec.objectStorage) {
      this.value.spec.objectStorage = {
        bucket: '',
        prefix: '',
        caCert: '',
      };
    }

    // Ensure config exists
    if (!this.value.spec.config) {
      this.value.spec.config = {};
    }

    return {
      secrets:            [],
      providerOptions:    PROVIDER_OPTIONS,
      accessModeOptions:  ACCESS_MODE_OPTIONS,
      selectedProvider:   this.value.spec.provider || 'aws',
    };
  },

  computed: {
    secretOptions() {
      // Filter secrets to only show those in the same namespace as the BSL
      // or in the velero namespace where credentials are typically stored
      const bslNamespace = this.value.metadata?.namespace;

      return this.secrets
        .filter((s) => {
          const secretNs = s.metadata?.namespace;

          return secretNs === bslNamespace || secretNs === 'velero';
        })
        .map((secret) => ({
          label: `${ secret.metadata?.namespace }/${ secret.metadata?.name }`,
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

    isView() {
      return this.mode === 'view';
    },
  },

  watch: {
    'value.spec.provider'(newVal, oldVal) {
      // Reset config when provider changes
      if (newVal !== oldVal) {
        this.$set(this.value.spec, 'config', {});
      }
    },
  },

  methods: {
    updateConfig(val) {
      this.$set(this.value.spec, 'config', val);
    },
    setCredential(name, key) {
      if (name && key) {
        this.$set(this.value.spec, 'credential', {
          name,
          key,
        });
      } else {
        this.$set(this.value.spec, 'credential', null);
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
            <h3>Storage Provider Configuration</h3>
            <p class="text-muted">
              Configure the cloud storage provider for backups.
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
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.accessMode"
              :mode="mode"
              :options="accessModeOptions"
              label="Access Mode"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="value.spec.default"
                :disabled="mode === 'view'"
              />
              <span>Set as Default</span>
            </label>
            <p class="text-muted">If true, this location will be used as the default for backups</p>
          </div>
        </div>
      </Tab>

      <!-- Object Storage Tab -->
      <Tab name="storage" label="Object Storage" :weight="90">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Object Storage Settings</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.objectStorage.bucket"
              :mode="mode"
              label="Bucket"
              required
              tooltip="The name of the bucket/container to store backups"
              placeholder="my-velero-bucket"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.objectStorage.prefix"
              :mode="mode"
              label="Prefix"
              tooltip="A prefix within the bucket for Velero backups"
              placeholder="backups/"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <LabeledInput
              v-model:value="value.spec.objectStorage.caCert"
              :mode="mode"
              label="CA Certificate (Base64)"
              type="multiline"
              tooltip="Base64-encoded CA certificate for self-signed certificates"
              placeholder="Base64-encoded CA certificate..."
            />
          </div>
        </div>
      </Tab>

      <!-- Credentials Tab -->
      <Tab name="credentials" label="Credentials" :weight="80">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Credential Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.credential.name"
              :mode="mode"
              :options="secretOptions"
              :searchable="true"
              :clearable="true"
              label="Secret Name"
              placeholder="Select a secret..."
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.credential.key"
              :mode="mode"
              label="Secret Key"
              tooltip="The key within the secret containing the credentials file"
              placeholder="cloud"
            />
          </div>
        </div>
      </Tab>

      <!-- Provider Config Tab -->
      <Tab name="config" label="Provider Config" :weight="70">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Provider-Specific Configuration</h3>
          </div>
        </div>

        <!-- AWS/S3 Config -->
        <template v-if="isAws">
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.region"
                :mode="mode"
                label="Region"
                tooltip="AWS region where the bucket is located"
                placeholder="us-east-1"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.s3Url"
                :mode="mode"
                label="S3 URL (for S3-compatible)"
                tooltip="Custom S3 endpoint URL for MinIO or other S3-compatible storage"
                placeholder="https://minio.example.com"
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-4">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="value.spec.config.s3ForcePathStyle === 'true'"
                  :disabled="mode === 'view'"
                  @change="(e) => $set(value.spec.config, 's3ForcePathStyle', e.target.checked ? 'true' : 'false')"
                />
                <span>Force Path Style</span>
              </label>
              <p class="text-muted">Use path-style addressing instead of virtual hosted-style (required for MinIO)</p>
            </div>
            <div class="col span-4">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="value.spec.config.insecureSkipTLSVerify === 'true'"
                  :disabled="mode === 'view'"
                  @change="(e) => $set(value.spec.config, 'insecureSkipTLSVerify', e.target.checked ? 'true' : 'false')"
                />
                <span>Skip TLS Verification</span>
              </label>
              <p class="text-muted">Skip TLS certificate verification (not recommended for production)</p>
            </div>
            <div class="col span-4">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :checked="value.spec.config.enableSharedConfig === 'true'"
                  :disabled="mode === 'view'"
                  @change="(e) => $set(value.spec.config, 'enableSharedConfig', e.target.checked ? 'true' : 'false')"
                />
                <span>Enable Shared Config</span>
              </label>
              <p class="text-muted">Use shared AWS config file for authentication</p>
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.publicUrl"
                :mode="mode"
                label="Public URL"
                tooltip="Public URL for downloading backups (if different from internal URL)"
                placeholder="https://backups.example.com"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.kmsKeyId"
                :mode="mode"
                label="KMS Key ID"
                tooltip="AWS KMS key ID for server-side encryption"
                placeholder="arn:aws:kms:..."
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.customerKeyEncryptionFile"
                :mode="mode"
                label="Customer Key Encryption File"
                tooltip="Path to customer-provided encryption key file"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.signatureVersion"
                :mode="mode"
                label="Signature Version"
                placeholder="4"
                tooltip="AWS signature version (default: 4)"
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.profile"
                :mode="mode"
                label="AWS Profile"
                tooltip="AWS profile name to use from credentials file"
                placeholder="default"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.checksumAlgorithm"
                :mode="mode"
                label="Checksum Algorithm"
                tooltip="Checksum algorithm for uploads (CRC32, CRC32C, SHA1, SHA256)"
                placeholder="CRC32"
              />
            </div>
          </div>
        </template>

        <!-- Azure Config -->
        <template v-if="isAzure">
          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.resourceGroup"
                :mode="mode"
                label="Resource Group"
                tooltip="Azure resource group name"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.storageAccount"
                :mode="mode"
                label="Storage Account"
                tooltip="Azure storage account name"
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.subscriptionId"
                :mode="mode"
                label="Subscription ID"
                tooltip="Azure subscription ID"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.storageAccountKeyEnvVar"
                :mode="mode"
                label="Storage Account Key Env Var"
                tooltip="Environment variable containing storage account key"
                placeholder="AZURE_STORAGE_ACCOUNT_ACCESS_KEY"
              />
            </div>
          </div>

          <div class="row mb-20">
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.blockSizeInBytes"
                :mode="mode"
                label="Block Size (bytes)"
                tooltip="Block size for Azure blob uploads"
                placeholder="104857600"
              />
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
                tooltip="GCP project ID"
              />
            </div>
            <div class="col span-6">
              <LabeledInput
                v-model:value="value.spec.config.serviceAccount"
                :mode="mode"
                label="Service Account"
                tooltip="GCP service account email"
              />
            </div>
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

      <!-- Sync Settings Tab -->
      <Tab name="sync" label="Sync Settings" :weight="60">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Synchronization Settings</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.backupSyncPeriod"
              :mode="mode"
              label="Backup Sync Period"
              tooltip="How often to sync backup metadata from the storage location"
              placeholder="1m0s"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.validationFrequency"
              :mode="mode"
              label="Validation Frequency"
              tooltip="How often to validate the storage location"
              placeholder="1m0s"
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

code {
  background: var(--input-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.info-box {
  background-color: var(--info-bg, rgba(0, 123, 255, 0.1));
  border: 1px solid var(--info-border, rgba(0, 123, 255, 0.3));
  border-radius: 4px;
  padding: 15px;
  color: var(--info-text, var(--body-text));
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
</style>
