import { createWebHashHistory, createRouter, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[]=[
    {
        path: '/',
        component: () => import('../views/index.vue'),
    },{
        path: '/:g/:d/game/',
        component: () => import('../views/game.vue'),
        props:true,
    },{
        path: '/:g/:d/:p/task/',
        component: () => import('../views/task.vue'),
        props:true,
    },{
        path: '/:g/manage/',
        component: () => import('../views/manage.vue'),
        props:true,
    },{
        path: '/:g/:d/wait/',
        component: () => import('../views/wait.vue'),
        props:true,
    },{
        path: '/:g/meet/',
        component: () => import('../views/meet.vue'),
        props:true,
    },{
        path: '/:g/:d/meet/',
        component: () => import('../views/meetwait.vue'),
        props:true,
    },{
        path: '/:g/game/',
        component: () => import('../views/host.vue'),
        props:true,
    },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})