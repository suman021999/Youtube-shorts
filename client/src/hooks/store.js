import {configureStore} from '@reduxjs/toolkit'
import themeReducer from './themeSlice';
import sidebarReducer from './sidebarslice'



export const store =configureStore({
    reducer:{
        theme: themeReducer,
        sidebar: sidebarReducer,
   
    },

})
