<script>
export default {
  name: 'VeleroBackupStorageLocationDetail',
  props: {
    value: {
      type:     Object,
      required: true,
    },
  },
};
</script>

<template>
  <div class="velero-detail">
    <h1>{{ value.metadata?.name }}</h1>
    <div class="detail-section">
      <h3>Status</h3>
      <p><strong>Phase:</strong> {{ value.status?.phase || 'Unknown' }}</p>
      <p><strong>Last Synced:</strong> {{ value.status?.lastSyncedTime }}</p>
      <p><strong>Last Validation:</strong> {{ value.status?.lastValidationTime }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Provider:</strong> {{ value.spec?.provider }}</p>
      <p><strong>Bucket:</strong> {{ value.spec?.objectStorage?.bucket }}</p>
      <p><strong>Prefix:</strong> {{ value.spec?.objectStorage?.prefix }}</p>
      <p><strong>Default:</strong> {{ value.spec?.default || false }}</p>
      <p><strong>Access Mode:</strong> {{ value.spec?.accessMode }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.velero-detail {
  padding: 20px;

  .detail-section {
    margin-bottom: 20px;

    h3 {
      border-bottom: 1px solid var(--border);
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
  }
}
</style>
