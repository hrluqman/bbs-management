<template>
    <div class="form-container">
        <h1>{{ menu }}</h1>
        <div v-if="lists.length>0">
            <table class="table" data-classes="table" data-toggle="table" data-pagination="true">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Title</th>
                    <th scope="col">Views</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(list, index) of lists" :key="list.id">
                        <th scope="row">{{ ((currentPage-1)*totalPage + index+1)-currentPage+1 }}</th>
                        <td><router-link :to="{ name: 'bbs-view', params: { id: list.id}}">{{ list.title }}</router-link></td>
                        <td>{{ list.views }}</td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous" @click="getPage('previous')">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                    </li>
                    <li class="page-item" :class="{ active: currentPage==page}" v-for="page in pagination" :key="page"><a class="page-link" href="#" @click="getPage(page)">{{ page }}</a></li>
                    <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next" @click="getPage('next')">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="empty-container" v-if="lists.length==0">
            <img src="../assets/empty.svg" alt="empty">
            <p>No data available</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const route = useRoute()
        const lists = ref([]);
        const totalPage = ref(10);
        const currentPage = ref(1);
        const pagination = ref([1,2,3]);        

        const init = async (page:string) => {
            //Load list of post
            try {
                let datas = await fetch(`http://public.flexink.com:9250/api/public/bbs/post${page}`);
                if(!datas.ok) throw Error('No Data Available');
                datas.json().then(data=>{
                    lists.value = data.data;
                    totalPage.value = Math.ceil(data.count/10)
                });
            }
            catch (error) {
                if (error instanceof Error) alert(error.message);
                else alert(String(error));
            }
        }

        const getPage = (page:number | string) => {
            if(page=='previous' && currentPage.value>1) currentPage.value--;
            if(page=='next' && currentPage.value<totalPage.value) currentPage.value++;
            if(page!=='previous' && page!=='next') currentPage.value = Number(page);
            if(currentPage.value==pagination.value[pagination.value.length-1] && currentPage.value<totalPage.value) {
                pagination.value.shift();
                pagination.value.push(currentPage.value+1);
            }
            if(currentPage.value==pagination.value[0] && currentPage.value>1) {
                pagination.value.pop();
                pagination.value.unshift(currentPage.value-1);
            }
            let pageParams = `?pageNumber=${currentPage.value}`; 
            init(pageParams);
        } 

        onMounted(()=> {
            if(route.fullPath == '/bbs/list' || route.fullPath == '/') init('');
        })

        return { lists, totalPage, currentPage, pagination, getPage }

    },
    props: ['menu']
})
</script>