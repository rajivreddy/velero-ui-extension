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
import { _CREATE, _EDIT, _VIEW } from '@shell/config/query-params';

export default {
  name: 'VeleroVolumeSnapshotLocationEdit',

  components: {
    CruResource,
    NameNsDescription,
    Tab,
    Tabbed,
    Labels,
    LabeledInput,
    LabeledSelect,
    KeyValue,
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
        { label: 'CSI', value: 'csi' },
        { label: 'OpenStack', value: 'openstack' },
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

    config: {
      get() {
        return this.value.spec?.config || {};
      },
      set(val) {
        this.$set(this.value.spec, 'config', val);
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
        </div>
      </Tab>

      <Tab
        name="credentials"
        label="Credentials"
        :weight="90"
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
        :weight="80"
      >
        <div class="row mb-20">
          <div class="col span-12">
            <h3>Provider-Specific Configuration</h3>
            <p class="text-muted mb-10">
              Add provider-specific configuration options (e.g., region for AWS)
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
