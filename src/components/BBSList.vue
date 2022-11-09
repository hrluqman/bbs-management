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
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            lists: [], 
            currentPage: 1 as number,
            totalPage: 10,
            pagination: [1,2,3]
        }
    },
    methods: {
        init(page:string) {
            //Load list of post
            fetch(`http://public.flexink.com:9250/api/public/bbs/post${page}`)
            .then(res=>res.json())
            .then(data => {
                this.lists = data.data;
                this.totalPage = Math.ceil(data.count/10)
            })
            .catch(err=>alert(err.message))
        },
        getPage(page:number | string) {
            if(page=='previous' && this.currentPage>1) this.currentPage--;
            if(page=='next' && this.currentPage<this.totalPage) this.currentPage++;
            if(page!=='previous' && page!=='next') this.currentPage = Number(page);
            if(this.currentPage==this.pagination[this.pagination.length-1] && this.currentPage<this.totalPage) {
                this.pagination.shift();
                this.pagination.push(this.currentPage+1);
            }
            if(this.currentPage==this.pagination[0] && this.currentPage>1) {
                this.pagination.pop();
                this.pagination.unshift(this.currentPage-1);
            }
            let pageParams = `?pageNumber=${this.currentPage}`; 
            this.init(pageParams);
        } 
    },
    mounted()  {
        if(this.$route.fullPath == '/bbs/list' || this.$route.fullPath == '/') {
            this.init('');
        }
    },
    props: ['menu']
})
</script>