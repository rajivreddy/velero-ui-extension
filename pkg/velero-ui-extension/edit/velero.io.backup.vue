<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import Labels from '@shell/components/form/Labels';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import ArrayList from '@shell/components/form/ArrayList';
import KeyValue from '@shell/components/form/KeyValue';
import { Checkbox } from '@components/Form/Checkbox';
import { _CREATE, _EDIT, _VIEW } from '@shell/config/query-params';

export default {
  name: 'VeleroBackupEdit',

  components: {
    CruResource,
    NameNsDescription,
    Tab,
    Tabbed,
    Labels,
    LabeledInput,
    LabeledSelect,
    ArrayList,
    KeyValue,
    Checkbox,
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
      ttlOptions: [
        { label: '1 Hour', value: '1h0m0s' },
        { label: '4 Hours', value: '4h0m0s' },
        { label: '24 Hours', value: '24h0m0s' },
        { label: '7 Days', value: '168h0m0s' },
        { label: '30 Days', value: '720h0m0s' },
        { label: '90 Days', value: '2160h0m0s' },
        { label: '1 Year', value: '8760h0m0s' },
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

    includedNamespaces: {
      get() {
        return this.value.spec?.includedNamespaces || [];
      },
      set(val) {
        this.$set(this.value.spec, 'includedNamespaces', val);
      },
    },

    excludedNamespaces: {
      get() {
        return this.value.spec?.excludedNamespaces || [];
      },
      set(val) {
        this.$set(this.value.spec, 'excludedNamespaces', val);
      },
    },

    includedResources: {
      get() {
        return this.value.spec?.includedResources || [];
      },
      set(val) {
        this.$set(this.value.spec, 'includedResources', val);
      },
    },

    excludedResources: {
      get() {
        return this.value.spec?.excludedResources || [];
      },
      set(val) {
        this.$set(this.value.spec, 'excludedResources', val);
      },
    },

    labelSelector: {
      get() {
        return this.value.spec?.labelSelector?.matchLabels || {};
      },
      set(val) {
        if (!this.value.spec.labelSelector) {
          this.$set(this.value.spec, 'labelSelector', {});
        }
        this.$set(this.value.spec.labelSelector, 'matchLabels', val);
      },
    },

    storageLocation: {
      get() {
        return this.value.spec?.storageLocation || '';
      },
      set(val) {
        this.$set(this.value.spec, 'storageLocation', val);
      },
    },

    ttl: {
      get() {
        return this.value.spec?.ttl || '720h0m0s';
      },
      set(val) {
        this.$set(this.value.spec, 'ttl', val);
      },
    },

    includeClusterResources: {
      get() {
        return this.value.spec?.includeClusterResources ?? null;
      },
      set(val) {
        this.$set(this.value.spec, 'includeClusterResources', val);
      },
    },

    snapshotVolumes: {
      get() {
        return this.value.spec?.snapshotVolumes ?? null;
      },
      set(val) {
        this.$set(this.value.spec, 'snapshotVolumes', val);
      },
    },

    defaultVolumesToFsBackup: {
      get() {
        return this.value.spec?.defaultVolumesToFsBackup ?? false;
      },
      set(val) {
        this.$set(this.value.spec, 'defaultVolumesToFsBackup', val);
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
      description-key="spec.description"
    />

    <Tabbed :side-tabs="true">
      <Tab
        name="backup-scope"
        label="Backup Scope"
        :weight="100"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <h3>Included Namespaces</h3>
            <p class="text-muted mb-10">
              Leave empty to include all namespaces
            </p>
            <ArrayList
              v-model="includedNamespaces"
              :mode="mode"
              :add-label="'Add Namespace'"
            />
          </div>
          <div class="col span-6">
            <h3>Excluded Namespaces</h3>
            <p class="text-muted mb-10">
              Namespaces to exclude from the backup
            </p>
            <ArrayList
              v-model="excludedNamespaces"
              :mode="mode"
              :add-label="'Add Namespace'"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <h3>Included Resources</h3>
            <p class="text-muted mb-10">
              Leave empty to include all resources
            </p>
            <ArrayList
              v-model="includedResources"
              :mode="mode"
              :add-label="'Add Resource'"
            />
          </div>
          <div class="col span-6">
            <h3>Excluded Resources</h3>
            <p class="text-muted mb-10">
              Resource types to exclude from the backup
            </p>
            <ArrayList
              v-model="excludedResources"
              :mode="mode"
              :add-label="'Add Resource'"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h3>Label Selector</h3>
            <p class="text-muted mb-10">
              Only backup resources matching these labels
            </p>
            <KeyValue
              v-model="labelSelector"
              :mode="mode"
              :add-label="'Add Label'"
              :read-allowed="false"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="storage"
        label="Storage"
        :weight="90"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model="storageLocation"
              :mode="mode"
              label="Storage Location"
              placeholder="default"
            />
          </div>
          <div class="col span-6">
            <LabeledSelect
              v-model="ttl"
              :mode="mode"
              :options="ttlOptions"
              label="TTL (Time to Live)"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="options"
        label="Options"
        :weight="80"
      >
        <div class="row mb-20">
          <div class="col span-4">
            <Checkbox
              v-model="includeClusterResources"
              :mode="mode"
              label="Include Cluster Resources"
            />
          </div>
          <div class="col span-4">
            <Checkbox
              v-model="snapshotVolumes"
              :mode="mode"
              label="Snapshot Volumes"
            />
          </div>
          <div class="col span-4">
            <Checkbox
              v-model="defaultVolumesToFsBackup"
              :mode="mode"
              label="Default Volumes to FS Backup"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="labels"
        label="Labels & Annotations"
        :weight="70"
      >
        <Labels
          :value="value"
          :mode="mode"
        />
      </Tab>
    </Tabbed>
  </CruResource>
</template>
