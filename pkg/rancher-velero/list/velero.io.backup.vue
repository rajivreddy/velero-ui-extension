<script>
import ResourceTable from '@shell/components/ResourceTable';
import ResourceFetch from '@shell/mixins/resource-fetch';
import { VELERO_TYPES } from '../product';

export default {
  name:       'ListVeleroBackups',
  components: { ResourceTable },
  mixins:     [ResourceFetch],

  props: {
    resource: {
      type:     String,
      required: true,
    },
    schema: {
      type:     Object,
      default:  null,
    },
    useQueryParamsForSimpleFiltering: {
      type:    Boolean,
      default: false
    }
  },

  async fetch() {
    // Check if schema exists
    const backupSchema = this.$store.getters['cluster/schemaFor'](VELERO_TYPES.BACKUP);
    
    console.log('Velero Backup Schema:', backupSchema);
    console.log('Schema from props:', this.schema);
    console.log('Resource:', this.resource);
    
    if (backupSchema) {
      await this.$fetchType(this.resource);
    } else {
      console.warn('Velero Backup schema not found. Is Velero installed in this cluster?');
    }
  },

  data() {
    const schema = this.$store.getters['cluster/schemaFor'](VELERO_TYPES.BACKUP);
    
    return {
      internalSchema: schema,
    };
  },

  computed: {
    effectiveSchema() {
      return this.schema || this.internalSchema;
    },
    
    hasSchema() {
      return !!this.effectiveSchema;
    },
  },

  $loadingResources() {
    return { loadIndeterminate: true };
  },
};
</script>

<template>
  <div>
    <div v-if="!hasSchema" class="not-installed-banner">
      <h2>Velero Not Detected</h2>
      <p>The Velero Backup CRD was not found in this cluster.</p>
      <p>Please ensure Velero is installed. Visit the <a href="https://velero.io/docs/main/basic-install/" target="_blank" rel="noopener">official installation guide</a> for help.</p>
    </div>
    
    <ResourceTable
      v-else
      v-bind="$attrs"
      :rows="rows"
      :schema="effectiveSchema"
      :loading="loading"
      :use-query-params-for-simple-filtering="useQueryParamsForSimpleFiltering"
    />
  </div>
</template>

<style lang="scss" scoped>
.not-installed-banner {
  padding: 30px;
  background: var(--warning-bg, #fef9e7);
  border: 1px solid var(--warning-border, #f7dc6f);
  border-radius: var(--border-radius);
  text-align: center;

  h2 {
    color: var(--warning, #d68910);
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 10px;
  }

  a {
    color: var(--link);
  }
}
</style>
