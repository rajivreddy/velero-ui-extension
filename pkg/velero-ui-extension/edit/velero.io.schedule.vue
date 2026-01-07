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

const CRON_PRESETS = [
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Every 12 hours', value: '0 */12 * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Daily at 2 AM', value: '0 2 * * *' },
  { label: 'Weekly on Sunday at midnight', value: '0 0 * * 0' },
  { label: 'Monthly on the 1st at midnight', value: '0 0 1 * *' },
  { label: 'Custom', value: 'custom' },
];

export default {
  name:       'VeleroScheduleEdit',
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
    // Fetch backup storage locations
    try {
      this.backupStorageLocations = await this.$store.dispatch('cluster/findAll', { type: VELERO_TYPES.BACKUP_STORAGE_LOCATION });
    } catch (e) {
      this.backupStorageLocations = [];
    }

    // Fetch volume snapshot locations
    try {
      this.volumeSnapshotLocations = await this.$store.dispatch('cluster/findAll', { type: VELERO_TYPES.VOLUME_SNAPSHOT_LOCATION });
    } catch (e) {
      this.volumeSnapshotLocations = [];
    }
  },

  data() {
    if (!this.value.spec) {
      this.value.spec = {
        schedule:                   '',
        paused:                     false,
        useOwnerReferencesInBackup: false,
        skipImmediately:            false,
        template:                   {
          includedNamespaces:       [],
          excludedNamespaces:       [],
          includedResources:        [],
          excludedResources:        [],
          includeClusterResources:  null,
          storageLocation:          '',
          volumeSnapshotLocations:  [],
          ttl:                      '720h0m0s',
          snapshotVolumes:          null,
          snapshotMoveData:         null,
          defaultVolumesToFsBackup: null,
          labelSelector:            null,
          datamover:                '',
          csiSnapshotTimeout:       '',
          itemOperationTimeout:     '',
          hooks:                    { resources: [] },
          metadata:                 { labels: {} },
        },
      };
    }

    // Ensure template exists
    if (!this.value.spec.template) {
      this.value.spec.template = {
        includedNamespaces:       [],
        excludedNamespaces:       [],
        includedResources:        [],
        excludedResources:        [],
        storageLocation:          '',
        volumeSnapshotLocations:  [],
        ttl:                      '720h0m0s',
        hooks:                    { resources: [] },
        metadata:                 { labels: {} },
      };
    }

    // Determine if using preset or custom cron
    const currentSchedule = this.value.spec.schedule || '';
    const matchingPreset = CRON_PRESETS.find((p) => p.value === currentSchedule && p.value !== 'custom');

    return {
      backupStorageLocations:  [],
      volumeSnapshotLocations: [],
      cronPresets:             CRON_PRESETS,
      selectedPreset:          matchingPreset ? currentSchedule : 'custom',
      customCron:              matchingPreset ? '' : currentSchedule,
    };
  },

  computed: {
    storageLocationOptions() {
      return this.backupStorageLocations.map((bsl) => ({
        label: bsl.metadata?.name || bsl.id,
        value: bsl.metadata?.name || bsl.id,
      }));
    },

    volumeSnapshotLocationOptions() {
      return this.volumeSnapshotLocations.map((vsl) => ({
        label: vsl.metadata?.name || vsl.id,
        value: vsl.metadata?.name || vsl.id,
      }));
    },

    booleanOptions() {
      return [
        { label: 'Default (inherit from BSL)', value: null },
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];
    },

    isCustomCron() {
      return this.selectedPreset === 'custom';
    },

    isView() {
      return this.mode === 'view';
    },
  },

  watch: {
    selectedPreset(val) {
      if (val !== 'custom') {
        this.value.spec.schedule = val;
      } else {
        this.value.spec.schedule = this.customCron;
      }
    },
    customCron(val) {
      if (this.selectedPreset === 'custom') {
        this.value.spec.schedule = val;
      }
    },
  },

  methods: {
    updateIncludedNamespaces(val) {
      this.value.spec.template.includedNamespaces = val;
    },
    updateExcludedNamespaces(val) {
      this.value.spec.template.excludedNamespaces = val;
    },
    updateIncludedResources(val) {
      this.value.spec.template.includedResources = val;
    },
    updateExcludedResources(val) {
      this.value.spec.template.excludedResources = val;
    },
    updateVolumeSnapshotLocations(val) {
      this.value.spec.template.volumeSnapshotLocations = val;
    },
    updateLabels(val) {
      if (!this.value.spec.template.labelSelector) {
        this.value.spec.template.labelSelector = { matchLabels: {} };
      }
      this.value.spec.template.labelSelector.matchLabels = val;
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
      <!-- Schedule Tab -->
      <Tab name="schedule" label="Schedule" :weight="100">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Schedule Configuration</h3>
            <p class="text-muted">
              Configure when backups should be automatically created.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="selectedPreset"
              :mode="mode"
              :options="cronPresets"
              option-label="label"
              label="Schedule Preset"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-if="isCustomCron"
              v-model:value="customCron"
              :mode="mode"
              label="Cron Expression"
              placeholder="0 0 * * *"
              tooltip="Standard cron expression (minute hour day-of-month month day-of-week)"
            />
            <div v-else class="schedule-preview">
              <label>Cron Expression</label>
              <p class="preview-value">{{ value.spec.schedule }}</p>
            </div>
          </div>
        </div>

        <div v-if="isCustomCron" class="info-box mb-20">
          <p>
            <strong>Cron Format:</strong> minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, Sun=0)
          </p>
          <p>Examples: <code>0 2 * * *</code> (daily at 2 AM), <code>0 */6 * * *</code> (every 6 hours)</p>
        </div>

        <div class="row mb-20 mt-20">
          <div class="col span-4">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="value.spec.paused"
                :disabled="mode === 'view'"
              />
              <span>Paused</span>
            </label>
            <p class="text-muted">If true, the schedule will not create any backups</p>
          </div>
          <div class="col span-4">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="value.spec.skipImmediately"
                :disabled="mode === 'view'"
              />
              <span>Skip Immediately</span>
            </label>
            <p class="text-muted">If true, skip the first backup immediately upon schedule creation</p>
          </div>
          <div class="col span-4">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="value.spec.useOwnerReferencesInBackup"
                :disabled="mode === 'view'"
              />
              <span>Use Owner References</span>
            </label>
            <p class="text-muted">If true, backup will have owner reference to the schedule</p>
          </div>
        </div>
      </Tab>

      <!-- Backup Template - Namespaces Tab -->
      <Tab name="namespaces" label="Namespaces" :weight="90">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Namespace Selection</h3>
            <p class="text-muted">
              Specify which namespaces to include or exclude from scheduled backups.
            </p>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <ArrayList
              :value="value.spec.template.includedNamespaces || []"
              :mode="mode"
              :title="'Included Namespaces'"
              :add-label="'Add Namespace'"
              :protip="false"
              @input="updateIncludedNamespaces"
            />
          </div>
          <div class="col span-6">
            <ArrayList
              :value="value.spec.template.excludedNamespaces || []"
              :mode="mode"
              :title="'Excluded Namespaces'"
              :add-label="'Add Namespace'"
              :protip="false"
              @input="updateExcludedNamespaces"
            />
          </div>
        </div>
      </Tab>

      <!-- Backup Template - Resources Tab -->
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
              :value="value.spec.template.includedResources || []"
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
              :value="value.spec.template.excludedResources || []"
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
              v-model:value="value.spec.template.includeClusterResources"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Include Cluster Resources"
              tooltip="Whether to include cluster-scoped resources"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Label Selector</h4>
            <p class="text-muted">
              Only backup resources matching these labels.
            </p>
            <KeyValue
              :value="value.spec.template.labelSelector?.matchLabels || {}"
              :mode="mode"
              :add-label="'Add Label'"
              :read-allowed="false"
              @input="updateLabels"
            />
          </div>
        </div>
      </Tab>

      <!-- Backup Template - Storage Tab -->
      <Tab name="storage" label="Storage" :weight="70">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Storage Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.template.storageLocation"
              :mode="mode"
              :options="storageLocationOptions"
              
              :searchable="true"
              :clearable="true"
              label="Backup Storage Location"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.template.ttl"
              :mode="mode"
              label="TTL (Time To Live)"
              placeholder="720h0m0s"
              tooltip="How long each backup will be retained"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Volume Snapshot Locations</h4>
            <ArrayList
              :value="value.spec.template.volumeSnapshotLocations || []"
              :mode="mode"
              :add-label="'Add Volume Snapshot Location'"
              :protip="false"
              @input="updateVolumeSnapshotLocations"
            />
          </div>
        </div>
      </Tab>

      <!-- Backup Template - Volumes Tab -->
      <Tab name="volumes" label="Volumes" :weight="60">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Volume Backup Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.template.snapshotVolumes"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Snapshot Volumes"
              tooltip="Whether to take snapshots of PersistentVolumes"
            />
          </div>
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.template.defaultVolumesToFsBackup"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Default Volumes to File System Backup"
              tooltip="Whether to use file system backup (Restic/Kopia) by default"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.template.snapshotMoveData"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Snapshot Move Data"
              tooltip="Whether to move CSI snapshot data to backup storage"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.template.datamover"
              :mode="mode"
              label="Data Mover"
              placeholder="velero"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.template.csiSnapshotTimeout"
              :mode="mode"
              label="CSI Snapshot Timeout"
              placeholder="10m0s"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.template.itemOperationTimeout"
              :mode="mode"
              label="Item Operation Timeout"
              placeholder="4h0m0s"
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

.schedule-preview {
  label {
    display: block;
    font-size: 13px;
    color: var(--input-label);
    margin-bottom: 5px;
  }

  .preview-value {
    font-family: monospace;
    padding: 8px 10px;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
  }
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

  p {
    margin: 5px 0;
    &:first-child { margin-top: 0; }
    &:last-child { margin-bottom: 0; }
  }
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

.text-muted {
  color: var(--muted);
  font-size: 12px;
  margin-top: 4px;
}
</style>
