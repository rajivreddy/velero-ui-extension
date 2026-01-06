<script>
export default {
  name: 'VeleroScheduleDetail',
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
      <p><strong>Last Backup:</strong> {{ value.status?.lastBackup }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Schedule:</strong> {{ value.spec?.schedule }}</p>
      <p><strong>Template TTL:</strong> {{ value.spec?.template?.ttl }}</p>
      <p><strong>Included Namespaces:</strong> {{ value.spec?.template?.includedNamespaces?.join(', ') || 'All' }}</p>
      <p><strong>Paused:</strong> {{ value.spec?.paused || false }}</p>
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
