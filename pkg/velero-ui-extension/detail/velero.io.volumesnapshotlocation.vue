<script>
export default {
  name: 'VeleroVolumeSnapshotLocationDetail',
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
      <h3>Spec</h3>
      <p><strong>Provider:</strong> {{ value.spec?.provider }}</p>
      <p><strong>Credential:</strong> {{ value.spec?.credential?.name }}</p>
    </div>
    <div class="detail-section">
      <h3>Config</h3>
      <pre>{{ JSON.stringify(value.spec?.config, null, 2) }}</pre>
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
