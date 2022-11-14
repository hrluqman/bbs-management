import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ref } from 'vue'

const getForm = (props:any) => {
    const route = useRoute()
    const router = useRouter()
    const id = ref(route.params.id)
    const title = ref('')
    const content = ref('')
    const fileInput = ref('')
    const selectedFile = ref([] as Array<object>)
    const modifyFile = ref([] as Array<object>)

    const init = async () => {
        //Load detail post
        await axios.get(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`)
        .then(response => {
            const data = response.data;
            title.value = data.title;
            content.value = data.content;
            data.attachedFile == null ? selectedFile.value = [] : selectedFile.value = data.attachedFile.attachedFileInfos;
            selectedFile.value.forEach((element:any) => {
                //Create download link for file
                element['downloadLink'] = `http://public.flexink.com:9250/api/public/bbs/post/file/${data.id}/${data.attachedFile.id}/${element.id}?lang=en`;
            });
        })
        .catch(err=>alert(err.message))
    }

    const onFileSelected = (event:any) => {       
        fileInput.value = event.target.files[0];
        const formData = new FormData();
        formData.append('file', fileInput.value);
        const headers = {'Content-Type': 'multipart/form-data'}
        axios.post("http://public.flexink.com:9250/api/public/bbs/post/file", formData, { headers })
        .then(res=> {
            const files = {
                filename: res.data[0].filename,
                fileSize: res.data[0].fileSize,
                contentType: res.data[0].contentType,
                originalFilename: res.data[0].originalFilename,
            }
            selectedFile.value.push(files);
            //Remove duplicate
            const unique = [...new Map(selectedFile.value.map((m:any) => [m.filename, m])).values()];
            selectedFile.value = unique;        
            if(props.modify) modifyFile.value.push(files);
        })
        .catch(function(){
            alert("Failed to upload file. Please try again later.");
        });
    }

    const removeFile = async (id:number) => {
        if(props.modify) {
            const confirmRemove = confirm("Are you sure you want to permanently remove the picture?");
            if(!confirmRemove) return;
            selectedFile.value = selectedFile.value.filter(function (index:any){
                return index.downloadLink !== id
            });
            if(id==undefined) return;
            const URL = id.toString().replace('?lang=en', '');
            await axios.delete(URL).catch(err=>alert(err.message));  
        }
        selectedFile.value = selectedFile.value.filter(function (index:any){
            return index.id !== id
        });
    }

    const submitPost = async (e:Event) => {
        if(props.menu.includes('Member')) return;
        if(title.value=='' || content.value=='') return;
        e.preventDefault();
        const submitJson = {
            title: title.value,
            content: content.value,
            attachedFile: {
                attachedFileInfos: selectedFile.value
            }
        }
        //Register a post
        const headers = { "Content-Type": "application/json; charset=UTF-8" };
        await axios.post("http://public.flexink.com:9250/api/public/bbs/post", JSON.stringify(submitJson), { headers })
        .then(()=>{
            alert('Added Successfully!');
            router.push({ name: 'bbs-list' });
        })
        .catch(err=>alert(err.message));            
    }

    const deletePost = async (e:Event) => {
        e.preventDefault();
        const confirmDelete = confirm("Are you sure you want to permanently delete the post?");
        if(!confirmDelete) return;
        //Delete a post
        await axios.delete(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`)
        .then(() => {
            alert('Deleted Successfully!');
            router.push({ name: 'bbs-list' });
        })
        .catch(err=>alert(err.message));            
    }

    const modifyPost = async (e:Event) => {
        e.preventDefault();
        const submitJson = {
            title: title.value,
            content: content.value,
            attachedFile: {
                attachedFileInfos: modifyFile.value
            }
        }
        //Modify a post
        const headers = { "Content-Type": "application/json; charset=UTF-8" };
        await axios.put(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`, JSON.stringify(submitJson), { headers })
        .then(()=>{
            alert('Modified Successfully!');
            router.push({ name: 'bbs-view', params: { id: id.value} });
        })
        .catch(err=>alert(err.message));     
    }

    return { id, title, content, selectedFile, modifyFile, init, onFileSelected, removeFile, submitPost, deletePost, modifyPost }
}

export default getForm