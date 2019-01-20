<template>
  <b-container class="list-container">
    <div class="list-title-container">
      <b-row>
        <b-col class="list-header-title" cols="6">
          <h5>{{ properties.name }}</h5>
        </b-col>
        <b-col class="list-header-btn" cols="2">
          <b-button @click="modalAddTask = !modalAddTask" variant="outline-success">
            <fa :icon="['fas', 'plus']"/>
          </b-button>
        </b-col>
        <b-col class="list-header-btn" cols="2">
          <b-button @click="modalEdit = !modalEdit" variant="outline-primary">
            <fa :icon="['fas', 'pen']"/>
          </b-button>
        </b-col>
        <b-col class="list-header-btn" cols="2">
          <b-button @click="modalDelete = !modalDelete" variant="warning">
            <fa :icon="['fas', 'trash']"/>
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div class="tasks-container">
      <draggable v-model="tasks" class="drag-container">
        <transition-group>
          <b-row class="task-container" v-for="task in tasks" :key="task.id">
            <task :properties="task"/>
          </b-row>
        </transition-group>
      </draggable>
    </div>
    <b-modal
      v-model="modalAddTask"
      centered
      ref="modal"
      title="Add new task to list"
      @ok="handleAddTask"
    >
      <form>
        <b-form-input
          id="newTaskText"
          v-model="newTaskText"
          type="text"
          placeholder="Awesome task"
        />
      </form>
    </b-modal>
    <b-modal v-model="modalEdit" centered ref="modal" title="Edit list name" @ok="handleEdit">
      <form>
        <b-form-input v-model="newListName" type="text" :placeholder="properties.name"/>
      </form>
    </b-modal>
    <b-modal
      v-model="modalDelete"
      hide-header
      centered
      ref="modal"
      title="Delete list"
      @ok="handleDelete"
    >
      <p>
        Do you want to delete
        <b>'{{ properties.name }}'</b> list?
      </p>
      <p>All its tasks will be deleted!</p>
    </b-modal>
  </b-container>
</template>

<script>
import Task from '~/components/Task.vue'
import draggable from 'vuedraggable'

export default {
  components: {
    Task,
    draggable
  },
  props: {
    properties: {}
  },
  data() {
    return {
      tasks: [],
      modalAddTask: false,
      modalEdit: false,
      modalDelete: false,
      newListName: null,
      newTaskText: null
    }
  },
  methods: {
    async handleEdit(evt) {
      evt.preventDefault()
      if (!this.properties.name) return alert('No new name provided')
      const params = {
        name: this.newListName
      }

      try {
        await this.$axios.$put(
          'https://apitrello.herokuapp.com/list/' + this.properties.id,
          params,
          {
            headers: {
              Authorization: 'bearer ' + localStorage.getItem('authToken')
            }
          }
        )
        this.properties.name = this.newListName
        this.newListName = null
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
    },
    async handleDelete(evt) {
      try {
        await this.$axios.$delete(
          'https://apitrello.herokuapp.com/list/' + this.properties.id,
          {
            headers: {
              Authorization: 'bearer ' + localStorage.getItem('authToken')
            }
          }
        )
        this.$emit('deleteList', this.properties.id)
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
    },
    async handleAddTask(evt) {
      const params = {
        idlist: this.properties.id,
        task: this.newTaskText
      }

      try {
        const res = await this.$axios.$post(
          'https://apitrello.herokuapp.com/tasks/',
          params,
          {
            headers: {
              Authorization: 'bearer ' + localStorage.getItem('authToken')
            }
          }
        )
        this.newTaskText = null
        this.tasks.push(res)
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
  },
  async mounted() {
    try {
      const res = await this.$axios.$get(
        'https://apitrello.herokuapp.com/list/tasks/' + this.properties.id,
        {
          headers: {
            Authorization: 'bearer ' + localStorage.getItem('authToken')
          }
        }
      )
      this.tasks = res
    } catch (error) {
      switch (error.response.status) {
        case 204:
          alert('No existe la lista')
          break
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
</script>

<style scoped>
.card {
  margin-bottom: 0.3rem;
}

.tasks-container {
  padding: 5px;
  height: calc(100% - 44px);
  overflow-y: auto;
}
.list-header-title {
  padding: 5px;
  color: navy;
  text-align: left;
}

.list-header-btn {
  padding: 2px;
}

.list-header-btn button {
  width: 100%;
  height: 100%;
}

.list-container {
  height: 100%;
  border: 2px solid navy;
  border-radius: 0.3rem;
  padding: 0px;
}

.list-title-container {
  width: 100%;
  text-align: center;
  border-bottom: 2px solid navy;
}

.list-title-container > .row {
  margin: 0px;
}

.task-container {
  width: 100%;
  display: contents;
}

.drag-container {
  cursor: move;
}
</style>
