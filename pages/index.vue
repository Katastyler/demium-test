<template>
  <b-container class="index-container">
    <b-row class="lists-container">
      <draggable id="draggable" v-model="lists" class="drag-container">
        <transition-group>
          <b-col v-for="list in lists" :key="list.id" class="rows">
            <list :properties="list" @deleteList="deleteList"/>
          </b-col>
        </transition-group>
      </draggable>
    </b-row>
    <b-button v-b-modal.newListNameModal class="gen-list-button" variant="primary">
      <fa :icon="['fas', 'plus']"/>List
    </b-button>
    <b-modal
      id="newListNameModal"
      ref="modal"
      centered
      title="Submit list name"
      @ok="handleOk"
      @shown="clearName"
    >
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input v-model="newListName" type="text" placeholder="Awesome name"/>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import List from '~/components/List.vue'
import draggable from 'vuedraggable'

export default {
  components: {
    List,
    draggable
  },
  data() {
    return {
      lists: [],
      newListName: ''
    }
  },
  async mounted() {
    if (!localStorage.getItem('authToken')) {
      return this.$nuxt.$router.replace({ path: '/login' })
    }
    try {
      const res = await this.$axios.$get(
        'https://apitrello.herokuapp.com/list',
        {
          headers: {
            Authorization: 'bearer ' + localStorage.getItem('authToken')
          }
        }
      )
      this.lists = res
    } catch (error) {
      switch (error.response.status) {
        case 204:
          alert('No existen listas')
          break
        case 401:
          alert('No autorizado')
          break
        default:
          alert(error)
          break
      }
    }
  },
  methods: {
    async addList() {
      const params = {
        name: this.newListName
      }
      try {
        const res = await this.$axios.$post(
          'https://apitrello.herokuapp.com/list',
          params,
          {
            headers: {
              Authorization: 'bearer ' + localStorage.getItem('authToken')
            }
          }
        )
        this.lists.push(res)
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
    clearName() {
      this.newListName = ''
    },
    handleOk(evt) {
      evt.preventDefault()
      if (!this.newListName) {
        alert('Please enter a name')
      } else {
        this.$refs.modal.hide()
        this.addList()
      }
    },
    deleteList(id) {
      this.lists.forEach((list, index) => {
        if (list.id === id) this.lists.splice(index, 1)
      })
    }
  }
}
</script>

<style>
.index-container {
  min-height: 100vh;
  max-width: 100%;
}

.lists-container {
  height: 100%;
  overflow-x: auto;
  min-height: 100vh;
  display: block;
  white-space: nowrap;
}

.rows {
  width: 20rem;
  padding: 3rem 0.5rem;
  display: inline-flex;
  height: calc(100vh - 20px);
  cursor: move;
  cursor: grab;
}

.gen-list-button {
  position: fixed;
  bottom: 27px;
  left: 10px;
}
</style>
