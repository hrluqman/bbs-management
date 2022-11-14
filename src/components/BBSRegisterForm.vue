<template>
    <div class="form-container">
        <h1>{{ menu }}</h1>
        <form>
            <div class="input-container">
                <label for="title">Title</label>
                <input type="text" required v-model="title">
            </div>
            <div class="input-container">
                <label for="content">Content</label>
                <textarea name="content" cols="30" rows="10" required v-model="content"></textarea>
            </div>
            <div class="input-container">
                <label for="files" style="margin-right:0.5rem">Files</label>
                <div>
                    <input type="file" ref="fileInput" class="custom-file-input" @change="onFileSelected">
                    <div class="file-name">
                        <span v-for="file of selectedFile" :key="file.id" style="margin-right: 10px">{{file.filename}}<span class="delete" @click="removeFile(file.id)">X</span></span>
                    </div>
                </div>
            </div>
            <div class="confirm-container">
                <span>
                    <button class="btn" @click="submitPost">Save</button>
                </span>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import getForm from '../composables/getForm'

export default defineComponent({
    setup(props) {
        const { id, title, content, selectedFile, onFileSelected, removeFile, submitPost } = getForm(props)
        
        return { id, title, content, selectedFile, onFileSelected, removeFile, submitPost }
    },
    props: ['menu']
})
</script>