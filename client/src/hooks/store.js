import {configureStore} from '@reduxjs/toolkit'
import themeReducer from './themeSlice';
import sidebarReducer from './sidebarslice'
import blurReducer from './blurSlice';



export const store =configureStore({
    reducer:{
        theme: themeReducer,
        sidebar: sidebarReducer,
        blur: blurReducer,
   
    },

})
