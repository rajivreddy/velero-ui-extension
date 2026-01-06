<script>
export default {
  name: 'VeleroServerStatusRequestDetail',
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
      <p><strong>Server Version:</strong> {{ value.status?.serverVersion }}</p>
      <p><strong>Processed:</strong> {{ value.status?.processedTimestamp }}</p>
    </div>
    <div class="detail-section">
      <h3>Plugins</h3>
      <pre>{{ JSON.stringify(value.status?.plugins, null, 2) }}</pre>
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

    pre {
      background: var(--body-bg);
      padding: 10px;
      border-radius: 4px;
    }
  }
}
</style>
