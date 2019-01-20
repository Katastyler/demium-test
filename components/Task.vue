<template>
  <b-card>
    <b-container>
      <b-row align-h="end">
        <b-col>
          <h5>{{ properties.task }}</h5>
        </b-col>
        <b-col class="task-del-container">
          <b-button @click="modalEdit = !modalEdit" size="sm" variant="outline-primary">
            <fa :icon="['fas', 'pen']"/>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-form-textarea
          id="taskDescription"
          v-model="text"
          placeholder="Enter something"
          :rows="2"
          :max-rows="6"
        />
      </b-row>
    </b-container>
    <b-modal v-model="modalEdit" centered ref="modal" title="Edit task name" @ok="handleEdit">
      <b-form-input
        id="newTaskText"
        v-model="newTaskText"
        type="text"
        :placeholder="this.properties.task"
      />
    </b-modal>
  </b-card>
</template>

<script>
export default {
  props: {
    properties: {}
  },
  data() {
    return {
      text: null,
      modalEdit: false,
      newTaskText: null
    }
  },
  methods: {
    async handleEdit() {
      try {
        const params = {
          task: this.newTaskText
        }

        await this.$axios.$put(
          'https://apitrello.herokuapp.com/tasks/' + this.properties.id,
          params,
          {
            headers: {
              Authorization: 'bearer ' + localStorage.getItem('authToken')
            }
          }
        )
        this.properties.task = this.newTaskText
        this.newTaskText = null
      } catch (error) {
        switch (error.response.status) {
          case 401:
            alert('No autorizado')
            break
          default:
            alert(error)
            break
        }
      }
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 0.5rem;
}

.task-del-container {
  text-align-last: end;
  padding: 0;
}
</style>
