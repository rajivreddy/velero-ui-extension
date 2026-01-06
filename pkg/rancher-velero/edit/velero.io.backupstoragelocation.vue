<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import Labels from '@shell/components/form/Labels';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import KeyValue from '@shell/components/form/KeyValue';
import { Checkbox } from '@components/Form/Checkbox';
import SecretSelector from '@shell/components/form/SecretSelector';
import { _CREATE, _EDIT, _VIEW } from '@shell/config/query-params';
import { SECRET } from '@shell/config/types';

export default {
  name: 'VeleroBackupStorageLocationEdit',

  components: {
    CruResource,
    NameNsDescription,
    Tab,
    Tabbed,
    Labels,
    LabeledInput,
    LabeledSelect,
    KeyValue,
    Checkbox,
    SecretSelector,
  },

  mixins: [CreateEditView],

  inheritAttrs: false,

  props: {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: _EDIT,
    },
  },

  data() {
    // Initialize spec if not present
    if (!this.value.spec) {
      this.value.spec = {};
    }

    return {
      providerOptions: [
        { label: 'AWS', value: 'aws' },
        { label: 'Azure', value: 'azure' },
        { label: 'GCP', value: 'gcp' },
        { label: 'MinIO', value: 'aws' },
        { label: 'Other S3-Compatible', value: 'aws' },
      ],
      accessModeOptions: [
        { label: 'Read Write', value: 'ReadWrite' },
        { label: 'Read Only', value: 'ReadOnly' },
      ],
    };
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },

    isCreate() {
      return this.mode === _CREATE;
    },

    provider: {
      get() {
        return this.value.spec?.provider || '';
      },
      set(val) {
        this.$set(this.value.spec, 'provider', val);
      },
    },

    accessMode: {
      get() {
        return this.value.spec?.accessMode || 'ReadWrite';
      },
      set(val) {
        this.$set(this.value.spec, 'accessMode', val);
      },
    },

    defaultBackupStorageLocation: {
      get() {
        return this.value.spec?.default ?? false;
      },
      set(val) {
        this.$set(this.value.spec, 'default', val);
      },
    },

    bucket: {
      get() {
        return this.value.spec?.objectStorage?.bucket || '';
      },
      set(val) {
        if (!this.value.spec.objectStorage) {
          this.$set(this.value.spec, 'objectStorage', {});
        }
        this.$set(this.value.spec.objectStorage, 'bucket', val);
      },
    },

    prefix: {
      get() {
        return this.value.spec?.objectStorage?.prefix || '';
      },
      set(val) {
        if (!this.value.spec.objectStorage) {
          this.$set(this.value.spec, 'objectStorage', {});
        }
        this.$set(this.value.spec.objectStorage, 'prefix', val);
      },
    },

    caCert: {
      get() {
        return this.value.spec?.objectStorage?.caCert || '';
      },
      set(val) {
        if (!this.value.spec.objectStorage) {
          this.$set(this.value.spec, 'objectStorage', {});
        }
        this.$set(this.value.spec.objectStorage, 'caCert', val);
      },
    },

    config: {
      get() {
        return this.value.spec?.config || {};
      },
      set(val) {
        this.$set(this.value.spec, 'config', val);
      },
    },

    credential: {
      get() {
        return this.value.spec?.credential || {};
      },
      set(val) {
        this.$set(this.value.spec, 'credential', val);
      },
    },

    credentialSecretName: {
      get() {
        return this.value.spec?.credential?.name || '';
      },
      set(val) {
        if (!this.value.spec.credential) {
          this.$set(this.value.spec, 'credential', {});
        }
        this.$set(this.value.spec.credential, 'name', val);
      },
    },

    credentialSecretKey: {
      get() {
        return this.value.spec?.credential?.key || 'cloud';
      },
      set(val) {
        if (!this.value.spec.credential) {
          this.$set(this.value.spec, 'credential', {});
        }
        this.$set(this.value.spec.credential, 'key', val);
      },
    },

    backupSyncPeriod: {
      get() {
        return this.value.spec?.backupSyncPeriod || '';
      },
      set(val) {
        this.$set(this.value.spec, 'backupSyncPeriod', val);
      },
    },

    validationFrequency: {
      get() {
        return this.value.spec?.validationFrequency || '';
      },
      set(val) {
        this.$set(this.value.spec, 'validationFrequency', val);
      },
    },
  },
};
</script>

<template>
  <CruResource
    :mode="mode"
    :resource="value"
    :errors="errors"
    :done-route="doneRoute"
    :can-yaml="true"
    @finish="save"
    @error="e => errors = e"
  >
    <NameNsDescription
      :value="value"
      :mode="mode"
      :namespaced="true"
    />

    <Tabbed :side-tabs="true">
      <Tab
        name="provider"
        label="Provider"
        :weight="100"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model="provider"
              :mode="mode"
              :options="providerOptions"
              label="Provider"
              :required="true"
            />
          </div>
          <div class="col span-6">
            <LabeledSelect
              v-model="accessMode"
              :mode="mode"
              :options="accessModeOptions"
              label="Access Mode"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <Checkbox
              v-model="defaultBackupStorageLocation"
              :mode="mode"
              label="Default Backup Storage Location"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="object-storage"
        label="Object Storage"
        :weight="90"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model="bucket"
              :mode="mode"
              label="Bucket"
              placeholder="velero-backups"
              :required="true"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model="prefix"
              :mode="mode"
              label="Prefix"
              placeholder="backups/"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <LabeledInput
              v-model="caCert"
              :mode="mode"
              label="CA Certificate"
              type="multiline"
              placeholder="Optional: CA certificate for self-signed certificates"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="credentials"
        label="Credentials"
        :weight="80"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model="credentialSecretName"
              :mode="mode"
              label="Secret Name"
              placeholder="cloud-credentials"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model="credentialSecretKey"
              :mode="mode"
              label="Secret Key"
              placeholder="cloud"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="provider-config"
        label="Provider Configuration"
        :weight="70"
      >
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Provider-Specific Configuration</h3>
            <p class="text-muted mb-10">
              Add provider-specific configuration options (e.g., region, s3Url, s3ForcePathStyle)
            </p>
            <KeyValue
              v-model="config"
              :mode="mode"
              :add-label="'Add Configuration'"
              :read-allowed="false"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="sync"
        label="Sync Settings"
        :weight="60"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model="backupSyncPeriod"
              :mode="mode"
              label="Backup Sync Period"
              placeholder="1m0s"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model="validationFrequency"
              :mode="mode"
              label="Validation Frequency"
              placeholder="1m0s"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="labels"
        label="Labels & Annotations"
        :weight="50"
      >
        <Labels
          :value="value"
          :mode="mode"
        />
      </Tab>
    </Tabbed>
  </CruResource>
</template>
