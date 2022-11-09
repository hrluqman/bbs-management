<template>
    <div class="form-container">
        <h1>{{ menu }}</h1>
        <form>
            <div class="input-container">
                <label for="title">Title</label>
                <input :readonly="viewing" type="text" required v-model="title">
            </div>
            <div class="input-container">
                <label for="content">Content</label>
                <textarea :readonly="viewing" name="content" cols="30" rows="10" required v-model="content"></textarea>
            </div>
            <div class="input-container">
                <label for="files" style="margin-right:0.5rem">Files</label>
                <div>
                    <input v-if="!viewing" type="file" ref="fileInput" class="custom-file-input" @change="onFileSelected">
                    <div class="file-name" v-if="viewing">
                        <span v-for="file of selectedFile" :key="file.id" style="margin-right: 10px"><a :href="file.downloadLink" download>{{file.filename}}</a></span>
                    </div>
                    <div class="file-name" v-if="!viewing && !modify">
                        <span v-for="file of selectedFile" :key="file.id" style="margin-right: 10px">{{file.filename}}<span class="delete" @click="removeFile(file.id)">X</span></span>
                    </div>
                    <div class="file-name" v-if="modify">
                        <span v-for="file of selectedFile" :key="file.downloadLink" style="margin-right: 10px">{{file.filename}}<span class="delete" @click="removeFile(file.downloadLink)">X</span></span>
                    </div>
                </div>
            </div>
            <div class="confirm-container">
                <span v-if="viewing">
                    <router-link :to="{ name: 'bbs-list'}"><button class="btn">List</button></router-link>
                    <router-link :to="{ name: 'bbs-modify', params: { id: id}}"><button class="btn">Update</button></router-link>
                </span>
                <span v-if="!viewing && modify">
                    <router-link :to="{ name: 'bbs-list'}"><button class="btn">List</button></router-link>
                    <button class="btn" @click="deletePost">Delete</button>
                    <button class="btn" @click="modifyPost">Modify</button>
                </span>
                <span v-if="!viewing && !modify">
                    <button class="btn" @click="submitPost">Save</button>
                </span>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {        
        return {
            id: this.$route.params.id,
            title: '' as string,
            content: '' as string | number,
            selectedFile: [] as Array<object>,
            modifyFile: [] as Array<object>
        }
    },
    methods: {
        onFileSelected(event:any) {
            let files = {
                id: Date.now(),
                filename: event.target.files[0].name,
                fileSize: event.target.files[0].size,
                contentType: event.target.files[0].type,
                originalFilename: event.target.files[0].name,
            }
            this.selectedFile.push(files);
            //Remove duplicate
            const unique = [...new Map(this.selectedFile.map((m:any) => [m.filename, m])).values()];
            this.selectedFile = unique;        
            if(this.modify) this.modifyFile.push(files);
            
            // //Upload a File
            // fetch("http://idc.flexink.com:9250/api/public/bbs/post/file", {
            //     method: "POST",
            //     body: event.target.files[0]
            // })
            // .then(res=>res.json)
            // .catch(err=>alert(err.message)); 
        },
        removeFile(id:number) {
            if(this.modify) {
                let confirmRemove = confirm("Are you sure you want to permanently remove the picture?");
                if(!confirmRemove) return;
                this.selectedFile = this.selectedFile.filter(function (index:any){
                    return index.downloadLink !== id
                });
                if(id==undefined) return;
                const URL = id.toString().replace('?lang=en', '');
                fetch(URL, { method: 'DELETE' })
                .catch(err=>alert(err.message));  
            }
            this.selectedFile = this.selectedFile.filter(function (index:any){
                return index.id !== id
            });
        },
        submitPost(e:Event) {
            if(this.menu.includes('Member')) return;
            if(this.title=='' || this.content=='') return;
            e.preventDefault();
            var submitJson = {
                title: this.title,
                content: this.content,
                attachedFile: {
                    attachedFileInfos: this.selectedFile
                }
            }
            //Register a post
            const requestOptions = {
                method: "POST",
                body: JSON.stringify(submitJson),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            };
            fetch("http://public.flexink.com:9250/api/public/bbs/post", requestOptions)
            .then(()=>{
                alert('Added Successfully!');
                this.$router.push({ name: 'bbs-list' });
            })
            .catch(err=>alert(err.message));            
        },
        deletePost(e:Event) {
            e.preventDefault();
            let confirmDelete = confirm("Are you sure you want to permanently delete the post?");
            if(!confirmDelete) return;
            //Delete a post
            fetch(`http://public.flexink.com:9250/api/public/bbs/post/${this.id}`, { method: 'DELETE' })
            .then(() => {
                alert('Deleted Successfully!');
                this.$router.push({ name: 'bbs-list' });
            })
            .catch(err=>alert(err.message));            
        },
        modifyPost(e:Event) {
            e.preventDefault();
            var submitJson = {
                title: this.title,
                content: this.content,
                attachedFile: {
                    attachedFileInfos: this.modifyFile
                }
            }
            //Register a post
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify(submitJson),
            };
            fetch(`http://public.flexink.com:9250/api/public/bbs/post/${this.id}`, requestOptions)
            .then(()=>{
                alert('Modified Successfully!');
                this.$router.push({ name: 'bbs-view', params: { id: this.id} });
            })
            .catch(err=>alert(err.message));     
        }
    },
    mounted() {
        if(this.viewing || this.modify) {
            //Load detail post
            fetch(`http://public.flexink.com:9250/api/public/bbs/post/${this.id}`)
            .then(res=>res.json())
            .then(data => {
                this.title = data.title;
                this.content = data.content;
                this.selectedFile = data.attachedFile.attachedFileInfos;
                // this.selectedFile.push({
                //     id: data.attachedFile.attachedFileInfos.id,
                //     filename: data.attachedFile.attachedFileInfos.,
                //     fileSize: data.attachedFile.attachedFileInfos.,
                //     contentType: data.attachedFile.attachedFileInfos.,
                //     originalFilename: data.attachedFile.attachedFileInfos.,
                // });
                this.selectedFile.forEach((element:any) => {
                    //Create download link for file
                    element['downloadLink'] = `http://public.flexink.com:9250/api/public/bbs/post/file/${data.id}/${data.attachedFile.id}/${element.id}?lang=en`;
                });
            })
            .catch(err=>alert(err.message))
        }
    },
    props: ['menu', 'viewing', 'modify']
})
</script>