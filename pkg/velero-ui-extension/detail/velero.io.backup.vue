<script>
export default {
  name: 'VeleroBackupDetail',
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
      <p><strong>Started:</strong> {{ value.status?.startTimestamp }}</p>
      <p><strong>Completed:</strong> {{ value.status?.completionTimestamp }}</p>
      <p><strong>Expiration:</strong> {{ value.status?.expiration }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Included Namespaces:</strong> {{ value.spec?.includedNamespaces?.join(', ') || 'All' }}</p>
      <p><strong>Excluded Namespaces:</strong> {{ value.spec?.excludedNamespaces?.join(', ') || 'None' }}</p>
      <p><strong>Storage Location:</strong> {{ value.spec?.storageLocation }}</p>
      <p><strong>TTL:</strong> {{ value.spec?.ttl }}</p>
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
