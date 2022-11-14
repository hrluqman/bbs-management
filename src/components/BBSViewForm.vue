<template>
    <div class="form-container">
        <h1>{{ menu }}</h1>
        <form>
            <div class="input-container">
                <label for="title">Title</label>
                <input readonly type="text" required v-model="title">
            </div>
            <div class="input-container">
                <label for="content">Content</label>
                <textarea readonly name="content" cols="30" rows="10" required v-model="content"></textarea>
            </div>
            <div class="input-container">
                <label for="files" style="margin-right:0.5rem">Files</label>
                <div>
                    <div class="file-name">
                        <span v-for="file of selectedFile" :key="file.id" style="margin-right: 10px"><a :href="file.downloadLink" download>{{file.filename}}</a></span>
                    </div>
                </div>
            </div>
            <div class="confirm-container">
                <span>
                    <router-link :to="{ name: 'bbs-list'}"><button class="btn">List</button></router-link>
                    <router-link :to="{ name: 'bbs-modify', params: { id: id}}"><button class="btn">Update</button></router-link>
                </span>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import getForm from '../composables/getForm'

export default defineComponent({
    setup() {
        const { id, title, content, selectedFile, init } = getForm('')

        onMounted(async ()=> init())

        return { id, title, content, selectedFile }
    },
    props: ['menu']
})
</script>