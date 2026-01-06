<script>
/**
 * Generic Velero CRD Edit Component
 * 
 * This component provides a basic edit interface for Velero CRDs that
 * don't have custom form components. It uses YAML editing as the primary
 * mode while showing read-only status information.
 */
import CreateEditView from '@shell/mixins/create-edit-view';
import CruResource from '@shell/components/CruResource';
import NameNsDescription from '@shell/components/form/NameNsDescription';
import Labels from '@shell/components/form/Labels';
import Tab from '@shell/components/Tabbed/Tab';
import Tabbed from '@shell/components/Tabbed';
import { _CREATE, _EDIT, _VIEW } from '@shell/config/query-params';

export default {
  name: 'VeleroGenericEdit',

  components: {
    CruResource,
    NameNsDescription,
    Labels,
    Tab,
    Tabbed,
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

  computed: {
    isView() {
      return this.mode === _VIEW;
    },

    isCreate() {
      return this.mode === _CREATE;
    },

    resourceType() {
      return this.value?.type || 'Unknown';
    },

    displayType() {
      const type = this.resourceType;
      // Convert velero.io.podvolumebackup to Pod Volume Backup
      const parts = type.split('.');
      const lastPart = parts[parts.length - 1];
      return lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
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
        name="configuration"
        label="Configuration"
        :weight="100"
      >
        <div class="mb-20">
          <p class="text-muted">
            This {{ displayType }} resource can be configured via YAML. 
            Click "Edit as YAML" to modify the resource specification directly.
          </p>
        </div>

        <div v-if="value.spec" class="resource-spec">
          <h3>Current Specification</h3>
          <pre class="spec-preview">{{ JSON.stringify(value.spec, null, 2) }}</pre>
        </div>
      </Tab>

      <Tab
        name="labels"
        label="Labels & Annotations"
        :weight="90"
      >
        <Labels
          :value="value"
          :mode="mode"
        />
      </Tab>
    </Tabbed>
  </CruResource>
</template>

<style lang="scss" scoped>
.resource-spec {
  .spec-preview {
    background-color: var(--body-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 15px;
    overflow: auto;
    max-height: 400px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
  }
}
</style>
