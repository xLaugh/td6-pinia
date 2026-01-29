<template>
  <div class="time-entry-card">
    <div class="entry-header">
      <div class="entry-info">
        <h4 class="entry-title">{{ projectName }} - {{ activityName }}</h4>
        <p class="entry-time">
          {{ formatTime(entry.start) }} 
          <span v-if="entry.end">- {{ formatTime(entry.end) }}</span>
          <span v-else class="badge-running">En cours</span>
        </p>
        <div v-if="activityColor" class="activity-color-badge" :style="{ backgroundColor: activityColor }"></div>
      </div>
      <div class="entry-actions">
        <button @click="$emit('edit', entry)" class="btn btn-icon btn-edit" title="Modifier">
          ✏️
        </button>
        <button @click="$emit('delete', entry.id)" class="btn btn-icon btn-delete" title="Supprimer">
          🗑️
        </button>
      </div>
    </div>
    <p v-if="entry.comment" class="entry-comment">{{ entry.comment }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '../stores/data'

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const dataStore = useDataStore()

const projectName = computed(() => {
  return dataStore.projects.find(p => p.id === props.entry.project_id)?.name || 'Inconnu'
})

const activityName = computed(() => {
  return dataStore.activities.find(a => a.id === props.entry.activity_id)?.name || 'Inconnu'
})

const activityColor = computed(() => {
  return dataStore.activities.find(a => a.id === props.entry.activity_id)?.color || null
})

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.time-entry-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.time-entry-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.entry-info {
  flex: 1;
}

.entry-title {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.entry-time {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  font-weight: 600;
}

.badge-running {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.activity-color-badge {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

.entry-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
}

.btn-edit {
  color: #17a2b8;
}

.btn-edit:hover {
  background-color: rgba(23, 162, 184, 0.1);
}

.btn-delete {
  color: #dc3545;
}

.btn-delete:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.entry-comment {
  color: #555;
  font-size: 0.95rem;
  margin: 1rem 0 0 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 3px solid #007bff;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .entry-header {
    flex-direction: column;
  }

  .entry-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
