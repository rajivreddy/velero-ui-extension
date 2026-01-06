<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import ArrayList from '@shell/components/form/ArrayList';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import KeyValue from '@shell/components/form/KeyValue';
import { VELERO_TYPES } from '../product';

const EXISTING_RESOURCE_POLICIES = [
  { label: 'None (skip existing resources)', value: 'none' },
  { label: 'Update (patch existing resources)', value: 'update' },
];

export default {
  name:       'VeleroRestoreEdit',
  components: {
    CruResource,
    NameNsDescription,
    LabeledInput,
    LabeledSelect,
    ArrayList,
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
    // Fetch backups for selection
    try {
      this.backups = await this.$store.dispatch('cluster/findAll', { type: VELERO_TYPES.BACKUP });
    } catch (e) {
      this.backups = [];
    }
  },

  data() {
    if (!this.value.spec) {
      this.value.spec = {
        backupName:                   '',
        scheduleName:                 '',
        includedNamespaces:           [],
        excludedNamespaces:           [],
        includedResources:            [],
        excludedResources:            [],
        namespaceMapping:             {},
        labelSelector:                null,
        orLabelSelectors:             null,
        restorePVs:                   null,
        restoreStatus:                null,
        preserveNodePorts:            null,
        includeClusterResources:      null,
        existingResourcePolicy:       '',
        itemOperationTimeout:         '',
        resourceModifier:             null,
        hooks:                        { resources: [] },
      };
    }

    return {
      backups:                     [],
      existingResourcePolicies:    EXISTING_RESOURCE_POLICIES,
    };
  },

  computed: {
    backupOptions() {
      return this.backups
        .filter((b) => b.status?.phase === 'Completed' || b.status?.phase === 'PartiallyFailed')
        .map((backup) => ({
          label: `${backup.metadata?.name} (${backup.status?.phase})`,
          value: backup.metadata?.name,
        }));
    },

    booleanOptions() {
      return [
        { label: 'Default', value: null },
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];
    },

    isView() {
      return this.mode === 'view';
    },

    selectedBackup() {
      return this.backups.find((b) => b.metadata?.name === this.value.spec.backupName);
    },
  },

  methods: {
    updateIncludedNamespaces(val) {
      this.$set(this.value.spec, 'includedNamespaces', val);
    },
    updateExcludedNamespaces(val) {
      this.$set(this.value.spec, 'excludedNamespaces', val);
    },
    updateIncludedResources(val) {
      this.$set(this.value.spec, 'includedResources', val);
    },
    updateExcludedResources(val) {
      this.$set(this.value.spec, 'excludedResources', val);
    },
    updateLabels(val) {
      if (!this.value.spec.labelSelector) {
        this.$set(this.value.spec, 'labelSelector', { matchLabels: {} });
      }
      this.$set(this.value.spec.labelSelector, 'matchLabels', val);
    },
    updateNamespaceMapping(val) {
      this.$set(this.value.spec, 'namespaceMapping', val);
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
      <!-- Source Tab -->
      <Tab name="source" label="Backup Source" :weight="100">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Select Backup to Restore</h3>
            <p class="text-muted">
              Choose a completed backup to restore from.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.backupName"
              :mode="mode"
              :options="backupOptions"
              option-label="label"
              :searchable="true"
              label="Backup Name"
              required
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.scheduleName"
              :mode="mode"
              label="Schedule Name (Optional)"
              tooltip="If specified, restore from the latest backup of this schedule"
              placeholder="my-schedule"
            />
          </div>
        </div>

        <div v-if="selectedBackup" class="info-box mb-20">
          <div class="backup-info">
            <p><strong>Backup Details:</strong></p>
            <p>Phase: {{ selectedBackup.status?.phase }}</p>
            <p>Created: {{ selectedBackup.metadata?.creationTimestamp }}</p>
            <p v-if="selectedBackup.spec?.includedNamespaces?.length">
              Namespaces: {{ selectedBackup.spec.includedNamespaces.join(', ') }}
            </p>
            <p v-else>Namespaces: All</p>
          </div>
        </div>
      </Tab>

      <!-- Namespaces Tab -->
      <Tab name="namespaces" label="Namespaces" :weight="90">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Namespace Selection</h3>
            <p class="text-muted">
              Specify which namespaces to include or exclude from the restore.
              Leave empty to restore all namespaces from the backup.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <ArrayList
              :value="value.spec.includedNamespaces || []"
              :mode="mode"
              :title="'Included Namespaces'"
              :add-label="'Add Namespace'"
              :protip="false"
              @input="updateIncludedNamespaces"
            />
          </div>
          <div class="col span-6">
            <ArrayList
              :value="value.spec.excludedNamespaces || []"
              :mode="mode"
              :title="'Excluded Namespaces'"
              :add-label="'Add Namespace'"
              :protip="false"
              @input="updateExcludedNamespaces"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Namespace Mapping</h4>
            <p class="text-muted">
              Map source namespaces to different target namespaces during restore.
            </p>
            <KeyValue
              :value="value.spec.namespaceMapping || {}"
              :mode="mode"
              :add-label="'Add Mapping'"
              :read-allowed="false"
              key-label="Source Namespace"
              value-label="Target Namespace"
              @input="updateNamespaceMapping"
            />
          </div>
        </div>
      </Tab>

      <!-- Resources Tab -->
      <Tab name="resources" label="Resources" :weight="80">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Resource Selection</h3>
            <p class="text-muted">
              Specify which Kubernetes resource types to include or exclude.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <ArrayList
              :value="value.spec.includedResources || []"
              :mode="mode"
              :title="'Included Resources'"
              :add-label="'Add Resource Type'"
              :protip="false"
              placeholder="e.g., pods, deployments, configmaps"
              @input="updateIncludedResources"
            />
          </div>
          <div class="col span-6">
            <ArrayList
              :value="value.spec.excludedResources || []"
              :mode="mode"
              :title="'Excluded Resources'"
              :add-label="'Add Resource Type'"
              :protip="false"
              placeholder="e.g., events, pods"
              @input="updateExcludedResources"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.includeClusterResources"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Include Cluster Resources"
              tooltip="Whether to include cluster-scoped resources"
            />
          </div>
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.existingResourcePolicy"
              :mode="mode"
              :options="existingResourcePolicies"
              option-label="label"
              :clearable="true"
              label="Existing Resource Policy"
              tooltip="How to handle resources that already exist in the cluster"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Label Selector</h4>
            <p class="text-muted">
              Only restore resources matching these labels.
            </p>
            <KeyValue
              :value="value.spec.labelSelector?.matchLabels || {}"
              :mode="mode"
              :add-label="'Add Label'"
              :read-allowed="false"
              @input="updateLabels"
            />
          </div>
        </div>
      </Tab>

      <!-- Volumes Tab -->
      <Tab name="volumes" label="Volumes" :weight="70">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Volume Restore Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.restorePVs"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Restore Persistent Volumes"
              tooltip="Whether to restore PersistentVolume data from snapshots"
            />
          </div>
        </div>
      </Tab>

      <!-- Advanced Tab -->
      <Tab name="advanced" label="Advanced" :weight="60">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Advanced Options</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.preserveNodePorts"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Preserve Node Ports"
              tooltip="Whether to preserve NodePort service port numbers"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.itemOperationTimeout"
              :mode="mode"
              label="Item Operation Timeout"
              placeholder="4h0m0s"
              tooltip="Time to wait for async restore operations"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Restore Status</h4>
            <p class="text-muted">
              Configure which status fields to restore.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="value.spec.restoreStatus?.includedResources?.length > 0"
                :disabled="mode === 'view'"
                @change="(e) => {
                  if (!value.spec.restoreStatus) $set(value.spec, 'restoreStatus', {});
                  $set(value.spec.restoreStatus, 'includedResources', e.target.checked ? ['*'] : []);
                }"
              />
              <span>Restore Status for Custom Resources</span>
            </label>
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

.backup-info {
  p {
    margin: 5px 0;
  }
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
