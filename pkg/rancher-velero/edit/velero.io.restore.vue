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
  name: 'VeleroRestoreEdit',

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

    return {};
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },

    isCreate() {
      return this.mode === _CREATE;
    },

    backupName: {
      get() {
        return this.value.spec?.backupName || '';
      },
      set(val) {
        this.$set(this.value.spec, 'backupName', val);
      },
    },

    scheduleName: {
      get() {
        return this.value.spec?.scheduleName || '';
      },
      set(val) {
        this.$set(this.value.spec, 'scheduleName', val);
      },
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

    namespaceMapping: {
      get() {
        return this.value.spec?.namespaceMapping || {};
      },
      set(val) {
        this.$set(this.value.spec, 'namespaceMapping', val);
      },
    },

    restorePVs: {
      get() {
        return this.value.spec?.restorePVs ?? null;
      },
      set(val) {
        this.$set(this.value.spec, 'restorePVs', val);
      },
    },

    preserveNodePorts: {
      get() {
        return this.value.spec?.preserveNodePorts ?? null;
      },
      set(val) {
        this.$set(this.value.spec, 'preserveNodePorts', val);
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

    existingResourcePolicy: {
      get() {
        return this.value.spec?.existingResourcePolicy || '';
      },
      set(val) {
        this.$set(this.value.spec, 'existingResourcePolicy', val);
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
        name="source"
        label="Backup Source"
        :weight="100"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model="backupName"
              :mode="mode"
              label="Backup Name"
              placeholder="Enter backup name to restore from"
              :required="true"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model="scheduleName"
              :mode="mode"
              label="Schedule Name"
              placeholder="Or enter schedule name"
            />
          </div>
        </div>
      </Tab>

      <Tab
        name="restore-scope"
        label="Restore Scope"
        :weight="90"
      >
        <div class="row mb-20">
          <div class="col span-6">
            <h3>Included Namespaces</h3>
            <p class="text-muted mb-10">
              Leave empty to include all namespaces from the backup
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
              Namespaces to exclude from the restore
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
              Resource types to exclude from the restore
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
              Only restore resources matching these labels
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
        name="namespace-mapping"
        label="Namespace Mapping"
        :weight="80"
      >
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Namespace Mapping</h3>
            <p class="text-muted mb-10">
              Map namespaces to different names during restore (source → destination)
            </p>
            <KeyValue
              v-model="namespaceMapping"
              :mode="mode"
              :add-label="'Add Mapping'"
              :read-allowed="false"
              key-label="Source Namespace"
              value-label="Destination Namespace"
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
          <div class="col span-6">
            <LabeledSelect
              v-model="existingResourcePolicy"
              :mode="mode"
              :options="[
                { label: 'None (fail on conflict)', value: 'none' },
                { label: 'Update existing', value: 'update' },
              ]"
              label="Existing Resource Policy"
            />
          </div>
        </div>

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
              v-model="restorePVs"
              :mode="mode"
              label="Restore Persistent Volumes"
            />
          </div>
          <div class="col span-4">
            <Checkbox
              v-model="preserveNodePorts"
              :mode="mode"
              label="Preserve Node Ports"
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
