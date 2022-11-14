import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const getForm = (props:any) => {
    const route = useRoute()
    const router = useRouter()
    const id = ref(route.params.id)
    const title = ref('')
    const content = ref('')
    const selectedFile = ref([] as Array<object>)
    const modifyFile = ref([] as Array<object>)

    const init = async () => {
        //Load detail post
        await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`)
        .then(res=>res.json())
        .then(data => {
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
        const files = {
            id: Date.now(),
            filename: event.target.files[0].name,
            fileSize: event.target.files[0].size,
            contentType: event.target.files[0].type,
            originalFilename: event.target.files[0].name,
        }
        selectedFile.value.push(files);
        //Remove duplicate
        const unique = [...new Map(selectedFile.value.map((m:any) => [m.filename, m])).values()];
        selectedFile.value = unique;        
        if(props.modify) modifyFile.value.push(files);
        
        // //Upload a File
        // fetch("http://idc.flexink.com:9250/api/public/bbs/post/file", {
        //     method: "POST",
        //     body: event.target.files[0]
        // })
        // .then(res=>res.json)
        // .catch(err=>alert(err.message)); 
    }

    const removeFile = (id:number) => {
        if(props.modify) {
            const confirmRemove = confirm("Are you sure you want to permanently remove the picture?");
            if(!confirmRemove) return;
            selectedFile.value = selectedFile.value.filter(function (index:any){
                return index.downloadLink !== id
            });
            if(id==undefined) return;
            const URL = id.toString().replace('?lang=en', '');
            fetch(URL, { method: 'DELETE' })
            .catch(err=>alert(err.message));  
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
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(submitJson),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        };
        await fetch("http://public.flexink.com:9250/api/public/bbs/post", requestOptions)
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
        await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`, { method: 'DELETE' })
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
        //Register a post
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify(submitJson),
        };
        await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${id.value}`, requestOptions)
        .then(()=>{
            alert('Modified Successfully!');
            router.push({ name: 'bbs-view', params: { id: id.value} });
        })
        .catch(err=>alert(err.message));     
    }

    return { id, title, content, selectedFile, modifyFile, init, onFileSelected, removeFile, submitPost, deletePost, modifyPost }
}

export default getForm