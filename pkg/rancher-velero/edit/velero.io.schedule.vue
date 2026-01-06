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
  name: 'VeleroScheduleEdit',

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
      this.value.spec = { template: {} };
    }
    if (!this.value.spec.template) {
      this.value.spec.template = {};
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
      schedulePresets: [
        { label: 'Every Hour', value: '0 * * * *' },
        { label: 'Every 6 Hours', value: '0 */6 * * *' },
        { label: 'Daily at Midnight', value: '0 0 * * *' },
        { label: 'Weekly (Sunday Midnight)', value: '0 0 * * 0' },
        { label: 'Monthly (1st at Midnight)', value: '0 0 1 * *' },
        { label: 'Custom', value: 'custom' },
      ],
      selectedPreset: 'custom',
    };
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },

    isCreate() {
      return this.mode === _CREATE;
    },

    schedule: {
      get() {
        return this.value.spec?.schedule || '';
      },
      set(val) {
        this.$set(this.value.spec, 'schedule', val);
      },
    },

    paused: {
      get() {
        return this.value.spec?.paused ?? false;
      },
      set(val) {
        this.$set(this.value.spec, 'paused', val);
      },
    },

    useOwnerReferencesInBackup: {
      get() {
        return this.value.spec?.useOwnerReferencesInBackup ?? false;
      },
      set(val) {
        this.$set(this.value.spec, 'useOwnerReferencesInBackup', val);
      },
    },

    // Template fields (same as Backup)
    includedNamespaces: {
      get() {
        return this.value.spec?.template?.includedNamespaces || [];
      },
      set(val) {
        this.$set(this.value.spec.template, 'includedNamespaces', val);
      },
    },

    excludedNamespaces: {
      get() {
        return this.value.spec?.template?.excludedNamespaces || [];
      },
      set(val) {
        this.$set(this.value.spec.template, 'excludedNamespaces', val);
      },
    },

    includedResources: {
      get() {
        return this.value.spec?.template?.includedResources || [];
      },
      set(val) {
        this.$set(this.value.spec.template, 'includedResources', val);
      },
    },

    excludedResources: {
      get() {
        return this.value.spec?.template?.excludedResources || [];
      },
      set(val) {
        this.$set(this.value.spec.template, 'excludedResources', val);
      },
    },

    labelSelector: {
      get() {
        return this.value.spec?.template?.labelSelector?.matchLabels || {};
      },
      set(val) {
        if (!this.value.spec.template.labelSelector) {
          this.$set(this.value.spec.template, 'labelSelector', {});
        }
        this.$set(this.value.spec.template.labelSelector, 'matchLabels', val);
      },
    },

    storageLocation: {
      get() {
        return this.value.spec?.template?.storageLocation || '';
      },
      set(val) {
        this.$set(this.value.spec.template, 'storageLocation', val);
      },
    },

    ttl: {
      get() {
        return this.value.spec?.template?.ttl || '720h0m0s';
      },
      set(val) {
        this.$set(this.value.spec.template, 'ttl', val);
      },
    },

    includeClusterResources: {
      get() {
        return this.value.spec?.template?.includeClusterResources ?? null;
      },
      set(val) {
        this.$set(this.value.spec.template, 'includeClusterResources', val);
      },
    },

    snapshotVolumes: {
      get() {
        return this.value.spec?.template?.snapshotVolumes ?? null;
      },
      set(val) {
        this.$set(this.value.spec.template, 'snapshotVolumes', val);
      },
    },

    defaultVolumesToFsBackup: {
      get() {
        return this.value.spec?.template?.defaultVolumesToFsBackup ?? false;
      },
      set(val) {
        this.$set(this.value.spec.template, 'defaultVolumesToFsBackup', val);
      },
    },
  },

  methods: {
    selectPreset(preset) {
      if (preset !== 'custom') {
        this.schedule = preset;
      }
      this.selectedPreset = preset;
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
        name="schedule"
        label="Schedule"
        :weight="100"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model="selectedPreset"
              :mode="mode"
              :options="schedulePresets"
              label="Schedule Preset"
              @input="selectPreset"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model="schedule"
              :mode="mode"
              label="Cron Schedule"
              placeholder="0 0 * * *"
              :required="true"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <Checkbox
              v-model="paused"
              :mode="mode"
              label="Paused"
            />
          </div>
          <div class="col span-6">
            <Checkbox
              v-model="useOwnerReferencesInBackup"
              :mode="mode"
              label="Use Owner References in Backup"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="backup-scope"
        label="Backup Scope"
        :weight="90"
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
        :weight="80"
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
        :weight="70"
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
        :weight="60"
      >
        <Labels
          :value="value"
          :mode="mode"
        />
      </Tab>
    </Tabbed>
  </CruResource>
</template>
