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

export default {
  name:       'VeleroBackupEdit',
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

    // Fetch available namespaces
    try {
      this.allNamespaces = await this.$store.dispatch('cluster/findAll', { type: 'namespace' });
    } catch (e) {
      this.allNamespaces = [];
    }
  },

  data() {
    if (!this.value.spec) {
      this.value.spec = {
        includedNamespaces:      [],
        excludedNamespaces:      [],
        includedResources:       [],
        excludedResources:       [],
        includeClusterResources: null,
        labelSelector:           null,
        orLabelSelectors:        null,
        snapshotVolumes:         null,
        snapshotMoveData:        null,
        datamover:               '',
        storageLocation:         '',
        volumeSnapshotLocations: [],
        ttl:                     '720h0m0s',
        defaultVolumesToFsBackup: null,
        orderedResources:        null,
        csiSnapshotTimeout:      '',
        itemOperationTimeout:    '',
        resourcePolicy:          null,
        hooks:                   { resources: [] },
        metadata:                { labels: {} },
      };
    }

    // Ensure hooks structure exists
    if (!this.value.spec.hooks) {
      this.value.spec.hooks = { resources: [] };
    }

    return {
      backupStorageLocations:  [],
      volumeSnapshotLocations: [],
      allNamespaces:           [],
    };
  },

  computed: {
    storageLocationOptions() {
      return this.backupStorageLocations.map((bsl) => bsl.metadata?.name || bsl.id);
    },

    volumeSnapshotLocationOptions() {
      return this.volumeSnapshotLocations.map((vsl) => vsl.metadata?.name || vsl.id);
    },

    namespaceOptions() {
      return this.allNamespaces.map((ns) => ns.metadata?.name || ns.id);
    },

    booleanOptions() {
      return [
        { label: 'Default (inherit from schedule/BSL)', value: null },
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];
    },

    isView() {
      return this.mode === 'view';
    },
  },

  methods: {
    updateIncludedNamespaces(val) {
      this.value.spec.includedNamespaces = val;
    },
    updateExcludedNamespaces(val) {
      this.value.spec.excludedNamespaces = val;
    },
    updateIncludedResources(val) {
      this.value.spec.includedResources = val;
    },
    updateExcludedResources(val) {
      this.value.spec.excludedResources = val;
    },
    updateVolumeSnapshotLocations(val) {
      this.value.spec.volumeSnapshotLocations = val;
    },
    updateLabels(val) {
      if (!this.value.spec.labelSelector) {
        this.value.spec.labelSelector = { matchLabels: {} };
      }
      this.value.spec.labelSelector.matchLabels = val;
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
      <!-- Namespaces Tab -->
      <Tab name="namespaces" label="Namespaces" :weight="100">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Namespace Selection</h3>
            <p class="text-muted">
              Specify which namespaces to include or exclude from the backup.
              Leave empty to include all namespaces.
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
      </Tab>

      <!-- Resources Tab -->
      <Tab name="resources" label="Resources" :weight="90">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Resource Selection</h3>
            <p class="text-muted">
              Specify which Kubernetes resource types to include or exclude.
              Leave empty to include all resources.
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
              tooltip="Whether to include cluster-scoped resources in the backup"
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
              :value="value.spec.labelSelector?.matchLabels || {}"
              :mode="mode"
              :add-label="'Add Label'"
              :read-allowed="false"
              @input="updateLabels"
            />
          </div>
        </div>
      </Tab>

      <!-- Storage Tab -->
      <Tab name="storage" label="Storage" :weight="80">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Storage Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.storageLocation"
              :mode="mode"
              :options="storageLocationOptions"
              :searchable="true"
              :clearable="true"
              label="Backup Storage Location"
              tooltip="The backup storage location where this backup will be stored"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.ttl"
              :mode="mode"
              label="TTL (Time To Live)"
              tooltip="How long the backup will be retained. Format: 720h0m0s (30 days)"
              placeholder="720h0m0s"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Volume Snapshot Locations</h4>
            <ArrayList
              :value="value.spec.volumeSnapshotLocations || []"
              :mode="mode"
              :add-label="'Add Volume Snapshot Location'"
              :protip="false"
              @input="updateVolumeSnapshotLocations"
            />
          </div>
        </div>
      </Tab>

      <!-- Volumes Tab -->
      <Tab name="volumes" label="Volumes" :weight="70">
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Volume Backup Configuration</h3>
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.snapshotVolumes"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Snapshot Volumes"
              tooltip="Whether to take snapshots of PersistentVolumes"
            />
          </div>
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.defaultVolumesToFsBackup"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Default Volumes to File System Backup"
              tooltip="Whether to use file system backup (Restic/Kopia) for volumes by default"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledSelect
              v-model:value="value.spec.snapshotMoveData"
              :mode="mode"
              :options="booleanOptions"
              option-label="label"
              label="Snapshot Move Data"
              tooltip="Whether to move CSI snapshot data to the backup storage location"
            />
          </div>
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.datamover"
              :mode="mode"
              label="Data Mover"
              tooltip="The data mover to use (e.g., velero for built-in data mover)"
              placeholder="velero"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-6">
            <LabeledInput
              v-model:value="value.spec.csiSnapshotTimeout"
              :mode="mode"
              label="CSI Snapshot Timeout"
              tooltip="Time to wait for CSI snapshots to complete"
              placeholder="10m0s"
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
            <LabeledInput
              v-model:value="value.spec.itemOperationTimeout"
              :mode="mode"
              label="Item Operation Timeout"
              tooltip="Time to wait for async plugin operations to complete"
              placeholder="4h0m0s"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Ordered Resources</h4>
            <p class="text-muted">
              Specify the order in which resources of specific kinds should be backed up.
            </p>
            <KeyValue
              :value="value.spec.orderedResources || {}"
              :mode="mode"
              :add-label="'Add Resource Order'"
              :read-allowed="false"
              key-label="Resource Kind"
              value-label="Resource Names (comma-separated)"
              @input="(val) => $set(value.spec, 'orderedResources', val)"
            />
          </div>
        </div>

        <div class="row mb-20">
          <div class="col span-12">
            <h4>Backup Metadata Labels</h4>
            <KeyValue
              :value="value.spec.metadata?.labels || {}"
              :mode="mode"
              :add-label="'Add Label'"
              :read-allowed="false"
              @input="(val) => {
                if (!value.spec.metadata) $set(value.spec, 'metadata', {});
                $set(value.spec.metadata, 'labels', val);
              }"
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
</style>
